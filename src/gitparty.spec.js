import test from "jest-t-assert"
import stripColor from "strip-color"
import { I, pipe, fork } from "f-utility"
import {
  reader,
  processData,
  sideEffect,
  partyData,
  partyPrint,
  remapConfigData
} from "./gitparty"
import RAW_LEGEND from "./gitpartyrc.fixture.json"
import harness from "./data.fixture.json"
import { generateReport } from "./gitparty"
import { DEFAULT_CONFIG } from "./constants"
import { neue } from "./utils"
/* eslint-disable fp/no-mutation */
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test(`remapConfigData`, t => {
  const remapped = remapConfigData({
    k: true,
    x: { color: `red`, matches: [`\\**/x.js`] }
  })
  t.deepEqual(Object.keys(remapped), [`k`, `x`])
  t.truthy(remapped.k)
  const remapped2 = remapConfigData([1, 2, 3])
  t.deepEqual(remapped2, [1, 2, 3])
})

test(`partyData`, t => {
  const config = { filterMergeCommits: false, collapseAuthors: false }
  const data = harness.filter(({ type }) => type === `commit`).slice(-3)
  const modified = partyData(config, EXAMPLE_LEGEND, data)
  t.deepEqual(modified, [
    { date: `30-04-2018`, type: `banner` },
    {
      abbrevHash: `c182937`,
      analysis: {
        config: false,
        dependencies: false,
        gitpartyrc: false,
        js: true,
        lint: false,
        tests: false
      },
      author: `brekk`,
      authorDate: `2018-04-30 22:25:18 -0700`,
      authorDateRel: `12 days ago`,
      authorName: `brekk`,
      changes: { M: [`gitparty.js`, `src/gitparty.js`, `src/grouping.js`] },
      date: `30-04-2018`,
      files: [`gitparty.js`, `src/gitparty.js`, `src/grouping.js`],
      hash: `c182937`,
      ms: 1525152318000,
      status: [`M`, `M`, `M`],
      subject: `commit it while it works, dammit`,
      type: `commit`
    },
    {
      abbrevHash: `58b0786`,
      analysis: {
        config: true,
        dependencies: true,
        gitpartyrc: false,
        js: true,
        lint: false,
        tests: false
      },
      author: `brekk`,
      authorDate: `2018-04-30 21:56:57 -0700`,
      authorDateRel: `12 days ago`,
      authorName: `brekk`,
      changes: {
        M: [
          `package.json`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ]
      },
      date: `30-04-2018`,
      files: [
        `package.json`,
        `src/gitparty.js`,
        `src/grouping.js`,
        `src/legend.js`,
        `src/print.js`,
        `src/utils.js`,
        `yarn.lock`
      ],
      hash: `58b0786`,
      ms: 1525150617000,
      status: [`M`, `M`, `M`, `M`, `M`, `M`, `M`],
      subject: `better`,
      type: `commit`
    },
    {
      abbrevHash: `1c5ffd2`,
      analysis: {
        config: true,
        dependencies: true,
        gitpartyrc: false,
        js: true,
        lint: true,
        tests: false
      },
      author: `brekk`,
      authorDate: `2018-04-30 21:13:22 -0700`,
      authorDateRel: `12 days ago`,
      authorName: `brekk`,
      changes: {
        A: [
          `.babelrc`,
          `.eslintrc`,
          `.gitignore`,
          `.madgerc`,
          `.npmignore`,
          `circle.yml`,
          `gitparty.js`,
          `package-scripts.js`,
          `package.json`,
          `rollup/config.commonjs.js`,
          `rollup/config.es6.js`,
          `rollup/config.shared.js`,
          `src/alias.js`,
          `src/constants.js`,
          `src/filters.js`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/per-commit.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ]
      },
      date: `30-04-2018`,
      files: [
        `.babelrc`,
        `.eslintrc`,
        `.gitignore`,
        `.madgerc`,
        `.npmignore`,
        `circle.yml`,
        `gitparty.js`,
        `package-scripts.js`,
        `package.json`,
        `rollup/config.commonjs.js`,
        `rollup/config.es6.js`,
        `rollup/config.shared.js`,
        `src/alias.js`,
        `src/constants.js`,
        `src/filters.js`,
        `src/gitparty.js`,
        `src/grouping.js`,
        `src/legend.js`,
        `src/per-commit.js`,
        `src/print.js`,
        `src/utils.js`,
        `yarn.lock`
      ],
      hash: `1c5ffd2`,
      ms: 1525148002000,
      status: [
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`
      ],
      subject: `initial commit`,
      type: `commit`
    }
  ])
})
test(`partyData - with filters`, t => {
  const config = {
    filterMergeCommits: false,
    collapseAuthors: false,
    filter: `subject:initial~`
  }
  const data = harness.filter(({ type }) => type === `commit`).slice(-3)
  const modified = partyData(config, EXAMPLE_LEGEND, data)
  t.deepEqual(modified, [
    {
      date: `30-04-2018`,
      type: `banner`
    },
    {
      abbrevHash: `1c5ffd2`,
      analysis: {
        config: true,
        dependencies: true,
        gitpartyrc: false,
        js: true,
        lint: true,
        tests: false
      },
      author: `brekk`,
      authorDate: `2018-04-30 21:13:22 -0700`,
      authorDateRel: `12 days ago`,
      authorName: `brekk`,
      changes: {
        A: [
          `.babelrc`,
          `.eslintrc`,
          `.gitignore`,
          `.madgerc`,
          `.npmignore`,
          `circle.yml`,
          `gitparty.js`,
          `package-scripts.js`,
          `package.json`,
          `rollup/config.commonjs.js`,
          `rollup/config.es6.js`,
          `rollup/config.shared.js`,
          `src/alias.js`,
          `src/constants.js`,
          `src/filters.js`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/per-commit.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ]
      },
      date: `30-04-2018`,
      files: [
        `.babelrc`,
        `.eslintrc`,
        `.gitignore`,
        `.madgerc`,
        `.npmignore`,
        `circle.yml`,
        `gitparty.js`,
        `package-scripts.js`,
        `package.json`,
        `rollup/config.commonjs.js`,
        `rollup/config.es6.js`,
        `rollup/config.shared.js`,
        `src/alias.js`,
        `src/constants.js`,
        `src/filters.js`,
        `src/gitparty.js`,
        `src/grouping.js`,
        `src/legend.js`,
        `src/per-commit.js`,
        `src/print.js`,
        `src/utils.js`,
        `yarn.lock`
      ],
      hash: `1c5ffd2`,
      ms: 1525148002000,
      status: [
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`
      ],
      subject: `initial commit`,
      type: `commit`
    }
  ])
})

test(`partyData - with collapseAuthors`, t => {
  const config = { filterMergeCommits: false, collapseAuthors: true }
  const data = harness.filter(({ type }) => type === `commit`).slice(-3)
  const modified = partyData(config, EXAMPLE_LEGEND, data)
  t.deepEqual(modified, [
    { date: `30-04-2018`, type: `banner` },
    {
      abbrevHash: `1c5ffd2`,
      analysis: {
        config: true,
        dependencies: true,
        gitpartyrc: false,
        js: true,
        lint: true,
        tests: false
      },
      author: `brekk`,
      authorDate: `2018-04-30 21:13:22 -0700`,
      authorDateRel: `12 days ago`,
      authorName: `brekk`,
      changes: {
        A: [
          `.babelrc`,
          `.eslintrc`,
          `.gitignore`,
          `.madgerc`,
          `.npmignore`,
          `circle.yml`,
          `gitparty.js`,
          `package-scripts.js`,
          `package.json`,
          `rollup/config.commonjs.js`,
          `rollup/config.es6.js`,
          `rollup/config.shared.js`,
          `src/alias.js`,
          `src/constants.js`,
          `src/filters.js`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/per-commit.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ],
        M: [
          `gitparty.js`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `package.json`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ]
      },
      date: `30-04-2018`,
      files: [
        `gitparty.js`,
        `src/gitparty.js`,
        `src/grouping.js`,
        `package.json`,
        `src/legend.js`,
        `src/print.js`,
        `src/utils.js`,
        `yarn.lock`,
        `.babelrc`,
        `.eslintrc`,
        `.gitignore`,
        `.madgerc`,
        `.npmignore`,
        `circle.yml`,
        `package-scripts.js`,
        `rollup/config.commonjs.js`,
        `rollup/config.es6.js`,
        `rollup/config.shared.js`,
        `src/alias.js`,
        `src/constants.js`,
        `src/filters.js`,
        `src/per-commit.js`
      ],
      hash: `1c5ffd2`,
      hashes: [`c182937`, `58b0786`, `1c5ffd2`],
      ms: 1525148002000,
      multiple: true,
      status: [
        `M`,
        `M`,
        `M`,
        `M`,
        `M`,
        `M`,
        `M`,
        `M`,
        `M`,
        `M`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`
      ],
      subject: `commit it while it works, dammit + better + initial commit`,
      type: `commit`
    }
  ])
})

test(`partyPrint`, t => {
  const config = {
    filterMergeCommits: false,
    collapseAuthors: false,
    authorLength: 5
  }
  const commits = harness.filter(({ type }) => type === `commit`)
  const data = commits[commits.length - 1] // ?
  const leg = neue(EXAMPLE_LEGEND)
  leg.authorLength = 5
  const out = stripColor(partyPrint(config, leg, [data]))
  t.is(
    out,
    // eslint-disable-next-line max-len
    ` J  L        C  D     = 1c5ffd2 - initial commit                                        $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
  )
})

/* eslint-disable */
test(`sideEffect`, t => {
  let arr = []
  let i = 0
  const effect = (k, v) => {
    arr = arr.concat([k, v, i])
    i += 1
  }
  const input = {
    a: 1,
    b: 2,
    c: [`x`, `y`, `z`]
  }
  sideEffect(effect, input)
  t.deepEqual(arr, [`a`, 1, 0, `b`, 2, 1, `c`, `x`, 2, `c`, `y`, 3, `c`, `z`, 4])
})
/* eslint-enable */

test(`generateReport`, t => {
  const commits = harness.filter(({ type }) => type === `commit`)
  const leg = neue(EXAMPLE_LEGEND)
  leg.authorLength = 5 // eslint-disable-line
  const output = stripColor(
    generateReport({ authorLength: 5 }, leg, [commits[commits.length - 1]])
  )
  /* eslint-disable max-len */
  t.is(
    output,
    [
      `LEGEND:  J  = js  L  = lint  T  = tests  G  = gitpartyrc  C  = config  D  = dependencies`,
      ``,
      `                  30-04-2018                                                                                            `,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ].join(`\n`)
  )
  /* eslint-enable max-len */
})

test(`generateReport with config.json`, t => {
  const commits = harness.filter(({ type }) => type === `commit`)
  const CONF = neue(DEFAULT_CONFIG)
  CONF.j = true // eslint-disable-line
  const output = stripColor(
    generateReport(CONF, EXAMPLE_LEGEND, [commits[commits.length - 1]])
  )
  /* eslint-disable max-len */
  t.deepEqual(JSON.parse(output), [
    { date: `30-04-2018`, type: `banner` },
    {
      abbrevHash: `1c5ffd2`,
      analysis: {
        config: true,
        dependencies: true,
        gitpartyrc: false,
        js: true,
        lint: true,
        tests: false
      },
      author: `brekk`,
      authorDate: `2018-04-30 21:13:22 -0700`,
      authorDateRel: `12 days ago`,
      authorName: `brekk`,
      changes: {
        A: [
          `.babelrc`,
          `.eslintrc`,
          `.gitignore`,
          `.madgerc`,
          `.npmignore`,
          `circle.yml`,
          `gitparty.js`,
          `package-scripts.js`,
          `package.json`,
          `rollup/config.commonjs.js`,
          `rollup/config.es6.js`,
          `rollup/config.shared.js`,
          `src/alias.js`,
          `src/constants.js`,
          `src/filters.js`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/per-commit.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ]
      },
      date: `30-04-2018`,
      files: [
        `.babelrc`,
        `.eslintrc`,
        `.gitignore`,
        `.madgerc`,
        `.npmignore`,
        `circle.yml`,
        `gitparty.js`,
        `package-scripts.js`,
        `package.json`,
        `rollup/config.commonjs.js`,
        `rollup/config.es6.js`,
        `rollup/config.shared.js`,
        `src/alias.js`,
        `src/constants.js`,
        `src/filters.js`,
        `src/gitparty.js`,
        `src/grouping.js`,
        `src/legend.js`,
        `src/per-commit.js`,
        `src/print.js`,
        `src/utils.js`,
        `yarn.lock`
      ],
      hash: `1c5ffd2`,
      ms: 1525148002000,
      status: [
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`,
        `A`
      ],
      subject: `initial commit`,
      type: `commit`
    }
  ])
  /* eslint-enable max-len */
})

test.cb(`reader`, t => {
  const input = `${__dirname}/gitpartyrc.fixture.yml`
  reader(input).fork(I, x => {
    t.deepEqual(x, {
      js: { key: `J`, color: `bgBlueBright`, matches: [`src/*.js`] },
      lint: { key: `L`, color: `bgMagenta`, matches: [`\\**/.eslintrc`] },
      tests: { key: `T`, color: `bgRed`, matches: [`\\**/*.spec.js`] },
      gitpartyrc: {
        key: `G`,
        color: `bgRedBright`,
        matches: [`\\**/.gitpartyrc`]
      },
      config: {
        key: `C`,
        color: `bgCyan`,
        matches: [
          `\\**/package.json`,
          `\\**/rollup/*`,
          `\\**/webpack*`,
          `\\**/^.*`
        ]
      },
      dependencies: {
        key: `D`,
        color: `bgYellow`,
        matches: [`\\**/package.json`, `\\**/yarn.lock`]
      },
      collapseAuthors: true
    })
    t.end()
  })
})

test.cb(`processData`, t => {
  const input = `${__dirname}/gitpartyrc.fixture.yml`
  pipe(
    reader,
    processData(EXAMPLE_LEGEND),
    fork(I, output => {
      /* eslint-disable max-len */
      t.deepEqual(stripColor(output.split(`80ca7f7`)[1]).split(`\n`), [
        ` - fixed that hilarious problem of the tests never be... $ brekk | js`,
        `                  10-05-2018                                                                                            `,
        ` J     T           = 9bd10f4 - committing anything breaks the existing tests :joy... $ brekk | js`,
        ` J     T           = 5e131fb - passing tests again                                   $ brekk | js`,
        ` J     T  G  C  D  = 8a4f3a9 - nearing 100% coverage                                 $ brekk | gitpartyrc js json lock`,
        `                  09-05-2018                                                                                            `,
        ` J  L  T           = 4661430 - added a readme                                        $ brekk | eslintrc js md png`,
        `                  08-05-2018                                                                                            `,
        ` J                 = 9210f41 - refactor                                              $ brekk | js`,
        ` J                 = f64e517 - everything futurized but currently requires double... $ brekk | js`,
        ` J                 = aaa4e6c - more fluturization                                    $ brekk | js`,
        ` J                 = 40e3dbc - added fluture and clarifying intent                   $ brekk | js`,
        ` J           C  D  = c7f3eb7 - moving things around for the bin script               $ brekk | js json`,
        ` J     T     C  D  = 8886271 - this will likely break non-relative tests             $ brekk | js json lock`,
        `                  07-05-2018                                                                                            `,
        ` J  L  T  G        = fb50fbb - tests                                                 $ brekk | eslintrc gitpartyrc js json`,
        ` J        G        = fa928f4 - gitpartyrc                                            $ brekk | gitpartyrc js yml`,
        ` J           C  D  = f9e5c4f - added yaml config                                     $ brekk | js json lock yml`,
        ` J                 = 925a86e - getting cleaner                                       $ brekk | js`,
        ` J           C  D  = c2e257b - working again                                         $ brekk | js json lock yml`,
        `                  02-05-2018                                                                                            `,
        ` J           C  D  = b9d98d9 - process.cwd() over __dirname                          $ brekk | js json`,
        ` J                 = d9249be - pass lint                                             $ brekk | js`,
        ` J                 = c5f2766 - added some date grossness for now                     $ brekk | js`,
        ` J                 = e9569fb - pretty close to ready                                 $ brekk | js`,
        `                  01-05-2018                                                                                            `,
        ` J     T           = f3cc824 - utils covered                                         $ brekk | js`,
        ` J     T     C  D  = 08c0a46 - tests!                                                $ brekk | js json lock`,
        ` J  L              = 56b6a81 - cleanification                                        $ brekk | eslintrc js`,
        ` J                 = 8ea8fe8 - partial change                                        $ brekk | js`,
        ` J                 = bb2def9 - getting cleaner, legend can be extricated             $ brekk | js`,
        ` J                 = 21f377f - legend is almost fully extracted                      $ brekk | js`,
        ` J           C  D  = 852f7ac - add blob matching, start to clean up legend makery    $ brekk | js json lock`,
        ` J           C  D  = 322b8d0 - cleanups and more fp                                  $ brekk | js json lock`,
        `                  30-04-2018                                                                                            `,
        ` J                 = c182937 - commit it while it works, dammit                      $ brekk | js`,
        ` J           C  D  = 58b0786 - better                                                $ brekk | js json lock`,
        ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
      ])
      t.end()
    })
  )(input)
})
/* eslint-enable max-len */
/* eslint-enable fp/no-mutation */
