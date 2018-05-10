import path from 'path'
import test from 'jest-t-assert'
import stripColor from 'strip-color'
import { I } from 'f-utility'
import Future from 'fluture'
import {
  // write,
  partyData,
  partyPrint,
  processGitCommits,
  remapConfigData
} from './gitparty'
import RAW_LEGEND from './gitpartyrc.fixture.json'
import harness from './data.fixture.json'
import { generateReport } from './gitparty'
import { DEFAULT_CONFIG } from './constants'
import { j2, neue } from './utils'
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test(`partyData`, (t) => {
  const config = { collapseMergeCommits: false, collapseAuthors: false }
  const data = harness.filter(({ type }) => type === `commit`).slice(-3)
  const modified = partyData(config, EXAMPLE_LEGEND, data)
  t.deepEqual(modified, [
    { date: `30-04-2018`, type: `banner` },
    {
      status: [`M`, `M`, `M`],
      files: [`gitparty.js`, `src/gitparty.js`, `src/grouping.js`],
      abbrevHash: `c182937`,
      subject: `commit it while it works, dammit`,
      authorName: `brekk`,
      authorDate: `2018-04-30 22:25:18 -0700`,
      authorDateRel: `7 days ago`,
      ms: 1525152318000,
      date: `30-04-2018`,
      author: `brekk`,
      hash: `c182937`,
      changes: { M: [`gitparty.js`, `src/gitparty.js`, `src/grouping.js`] },
      type: `commit`,
      analysis: {
        js: true,
        lint: false,
        tests: false,
        gitpartyrc: false,
        config: false,
        dependencies: false
      }
    },
    {
      status: [`M`, `M`, `M`, `M`, `M`, `M`, `M`],
      files: [
        `package.json`,
        `src/gitparty.js`,
        `src/grouping.js`,
        `src/legend.js`,
        `src/print.js`,
        `src/utils.js`,
        `yarn.lock`
      ],
      abbrevHash: `58b0786`,
      subject: `better`,
      authorName: `brekk`,
      authorDate: `2018-04-30 21:56:57 -0700`,
      authorDateRel: `7 days ago`,
      ms: 1525150617000,
      date: `30-04-2018`,
      author: `brekk`,
      hash: `58b0786`,
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
      type: `commit`,
      analysis: {
        js: true,
        lint: false,
        tests: false,
        gitpartyrc: false,
        config: true,
        dependencies: true
      }
    },
    {
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
      abbrevHash: `1c5ffd2`,
      subject: `initial commit`,
      authorName: `brekk`,
      authorDate: `2018-04-30 21:13:22 -0700`,
      authorDateRel: `7 days ago`,
      ms: 1525148002000,
      date: `30-04-2018`,
      author: `brekk`,
      hash: `1c5ffd2`,
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
      type: `commit`,
      analysis: {
        js: true,
        lint: true,
        tests: false,
        gitpartyrc: false,
        config: true,
        dependencies: true
      }
    }
  ])
})

test(`partyPrint`, (t) => {
  const config = { collapseMergeCommits: false, collapseAuthors: false }
  const commits = harness.filter(({ type }) => type === `commit`)
  const data = commits[commits.length - 1] // ?
  const out = stripColor(partyPrint(config, EXAMPLE_LEGEND, [data]))
  t.is(
    out,
    // eslint-disable-next-line max-len
    ` J  L        C  D  = 1c5ffd2 - initial commit $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
  )
})

test(`generateReport`, (t) => {
  const commits = harness.filter(({ type }) => type === `commit`)
  const CONF = neue(DEFAULT_CONFIG)
  CONF.authorLength = 5; // eslint-disable-line
  const output = stripColor(
    generateReport(CONF, EXAMPLE_LEGEND, [commits[commits.length - 1]])
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

test(`generateReport with config.json`, (t) => {
  const commits = harness.filter(({ type }) => type === `commit`)
  const CONF = neue(DEFAULT_CONFIG)
  CONF.j = true; // eslint-disable-line
  const output = stripColor(
    generateReport(CONF, EXAMPLE_LEGEND, [commits[commits.length - 1]])
  )
  /* eslint-disable max-len */
  t.deepEqual(JSON.parse(output), [
    {
      date: `30-04-2018`,
      type: `banner`
    },
    {
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
      abbrevHash: `1c5ffd2`,
      subject: `initial commit`,
      authorName: `brekk`,
      authorDate: `2018-04-30 21:13:22 -0700`,
      authorDateRel: `7 days ago`,
      ms: 1525148002000,
      date: `30-04-2018`,
      author: `brekk`,
      hash: `1c5ffd2`,
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
      type: `commit`,
      analysis: {
        js: true,
        lint: true,
        tests: false,
        gitpartyrc: false,
        config: true,
        dependencies: true
      }
    }
  ])
  /* eslint-enable max-len */
})

test.cb(`processGitCommits`, (t) => {
  const CONF = neue(DEFAULT_CONFIG)
  CONF.authorLength = 5 // eslint-disable-line fp/no-mutation
  CONF.repo = path.resolve(__dirname, `..`) // eslint-disable-line fp/no-mutation
  const F = Future.of(EXAMPLE_LEGEND)
  const outputF = F.chain(processGitCommits(CONF))
  outputF.fork(I, (result) => {
    /* eslint-disable max-len */
    t.deepEqual(stripColor(result).split(`\n`), [
      `LEGEND:  J  = js  L  = lint  T  = tests  G  = gitpartyrc  C  = config  D  = dependencies`,
      ``,
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
    /* eslint-enable max-len */
    t.end()
  })
})
