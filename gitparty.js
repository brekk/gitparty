const gitlog = require('gitlog');
const chalk = require('chalk');
const {
  groupBy,
  uniq,
  padStart,
  padEnd,
  pipe,
  map,
  reduce,
  curry,
  filter,
} = require('lodash/fp');
const j2 = x => JSON.stringify(x, null, 2);
const merge = curry((x, y) => Object.assign({}, x, y));
const join = curry((delim, arr) => arr.join(delim));
const keys = Object.keys;
const LEGEND = {
  style: { key: `S`, fn: chalk.bgMagenta },
  frontend: { key: `F`, fn: chalk.bgGreen },
  backend: { key: `B`, fn: chalk.bgCyan },
  devops: { key: `D`, fn: chalk.bgYellow },
  tests: { key: `T`, fn: chalk.bgRed },
  assets: { key: `A`, fn: chalk.bgWhite },
};
const TOTAL_COMMITS = 100;
const SUBJECT_LENGTH = 50;

const arrayify = y => (file, i) => {
  const status = y.status[i];
  return [status, file];
};
const authorAliases = {};
const canonicalize = curry((struct, original, alias) => {
  if (!struct[alias]) {
    struct[alias] = original;
  }
  if (!struct[original]) {
    struct[original] = struct[alias];
  }
});
const canon = (a, b = a) => canonicalize(authorAliases, a, b);

canon(`dstumm`, `stummd`);
canon(`Jan Stepnicka`, `Jan Štěpnička`);
canon(`Brekk`, `brekk`);
// canon(`Thomas Shaddox`, `baddox`);
canon(`David Hrdlicka`, `czechdave`);
canon(`michael mangus`, `mmangus`);
canon(`Paul S. Chun`, `sixofhearts`);

const getCanonicalFromObject = curry((struct, key) => struct[key] || key);
const getCanon = getCanonicalFromObject(authorAliases);

const flattenArrays = (a, [k, v]) => merge(a, { [k]: (a[k] || []).concat(v) });
const summarize = curry((limit, str) =>
  padEnd(limit + 3, str.substr(0, limit) + `${str.length > limit ? `...` : ``}`)
);

const augmentAndRemap = y => {
  const {
    authorName: author,
    // authorDate: date,
    authorDateRel: date,
    abbrevHash: hash,
    subject,
    files,
  } = y;
  const changes = files.map(arrayify(y)).reduce(flattenArrays, {});
  // const changes = pipe(map(arrayify(y)), reduce(flattenArrays, {}))(files);
  return {
    date,
    hash,
    changes,
    subject,
    author,
  };
};

const filterFiletypes = curry((filetypes, arr) => {
  filetypes = Array.isArray(filetypes) ? filetypes : [filetypes];
  return pipe(
    filter(type => {
      return filter(file => file.indexOf(type) > -1, arr).length > 0;
    })
  )(filetypes);
});
const moreThanNone = x => x.length > 0;

const filetypes = changes =>
  pipe(
    keys,
    reduce((list, key) => {
      return uniq(
        list.concat(
          changes[key].map(file => file.substr(file.lastIndexOf('.') + 1))
        )
      ).sort();
    }, [])
  )(changes);
const anyFilesMatchFromObject = curry((changes, filetypes) => {
  return pipe(
    keys,
    reduce(
      (agg, key) =>
        agg || moreThanNone(filterFiletypes(filetypes, changes[key])),
      false
    )
  )(changes);
});

const analyze = ({ date, hash, changes, subject, author }) => {
  const any = anyFilesMatchFromObject(changes);
  return {
    type: `commit`,
    date,
    hash,
    changes,
    subject,
    author: getCanon(author),
    analysis: {
      style: any(`scss`),
      tests: any(`specs.js`),
      frontend: any([`scss`, `js`, `package.json`]),
      backend: any(`py`),
      assets: any([`jpg`, `png`, `svg`]),
      devops: any([`bin`, `html`, `yml`]),
    },
  };
};
const print = curry(
  (x, fn, token) => (x ? chalk.black(fn(` ${token} `)) : `   `)
);
const colorize = ({ date, type, hash, changes, subject, author, analysis }) => {
  if (type === `banner`) {
    // 29 aligns it to the end of the
    return chalk.bgWhite(chalk.black(padEnd(120, padStart(29, date))));
  } else if (type === `commit`) {
    const { style, frontend, backend, assets, devops, tests } = analysis;
    const __hash = chalk.yellow(hash);
    const __summary = summarize(SUBJECT_LENGTH, subject);
    const __author = chalk.red(padEnd(20, author));
    const __style = print(style, LEGEND.style.fn, LEGEND.style.key);
    const __frontend = print(frontend, LEGEND.frontend.fn, LEGEND.frontend.key);
    const __backend = print(backend, LEGEND.backend.fn, LEGEND.backend.key);
    const __assets = print(assets, LEGEND.assets.fn, LEGEND.assets.key);
    const __devops = print(devops, LEGEND.devops.fn, LEGEND.devops.key);
    const __tests = print(tests, LEGEND.tests.fn, LEGEND.tests.key);
    const __analysis = `${__style}${__frontend}${__backend}${__devops}${__assets}${__tests}`;
    return `${__analysis} = ${__hash} - ${__summary} $ ${__author} | ${filetypes(
      changes
    ).join(' ')}`;
  }
};
const collapseSuccessiveSameAuthor = x => {
  const y = [];
  let prev = false;
  let lastIndex = false;
  for (let i = 0; i < x.length; i++) {
    let curr = x[i];
    if (i > 0 && lastIndex && prev && curr && prev.author === curr.author) {
      y[y.length - 1] = merge(prev, {
        subject: `[+] ` + prev.subject + ` && ` + curr.subject,
        changes: merge(prev.changes, curr.changes),
        analysis: {
          style: prev.analysis.style || curr.analysis.style,
          tests: prev.analysis.tests || curr.analysis.tests,
          frontend: prev.analysis.frontend || curr.analysis.frontend,
          backend: prev.analysis.backend || curr.analysis.backend,
          assets: prev.analysis.assets || curr.analysis.assets,
          devops: prev.analysis.devops || curr.analysis.devops,
        },
      });
    } else {
      y.push(curr);
    }
    prev = curr;
    lastIndex = i;
  }
  return y;
};

const isAMergeCommit = x =>
  x && x.subject && x.subject.substr(0, 6) !== `Merge `;
const getNumber = x => Number(x.substr(0, x.indexOf(' ')));
const createBannersFromGroups = groupedCommits =>
  pipe(
    keys,
    keys => keys.sort((a, b) => getNumber(a) - getNumber(b)),
    reduce((list, key) => {
      const group = groupedCommits[key];
      return list.concat({ date: key, type: `banner` }, group);
    }, [])
  )(groupedCommits);

const gitparty = pipe(
  x => x.sort(({ date }, { date: newDate }) => newDate - date),
  filter(isAMergeCommit),
  map(pipe(augmentAndRemap, analyze)),
  collapseSuccessiveSameAuthor,
  groupBy(`date`),
  createBannersFromGroups,
  map(colorize),
  join(`\n`)
);
const printLegend = () => {
  return (
    `LEGEND: ` +
    Object.keys(LEGEND)
      .map(key => {
        const value = LEGEND[key];
        return `${chalk.black(value.fn(` ${value.key} `))} = ${key}`;
      })
      .join(` `) +
    `\n`
  );
};

gitlog(
  {
    repo: __dirname,
    number: TOTAL_COMMITS,
    fields: [
      `abbrevHash`,
      `subject`,
      `authorName`,
      `authorDate`,
      `authorDateRel`,
    ],
    execOptions: { maxBuffer: 1000 * 1024 },
  },
  (e, d) => {
    if (e) return console.log(e);
    console.log(printLegend());
    console.log(gitparty(d));
  }
);
