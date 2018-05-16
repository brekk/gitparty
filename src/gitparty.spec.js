import path from "path"
import test from "jest-t-assert"
import stripColor from "strip-color"
import { I } from "f-utility"
import Future from "fluture"
import {
  // write,
  partyData,
  partyPrint,
  processGitCommits,
  remapConfigData
} from "./gitparty"
import RAW_LEGEND from "./gitpartyrc.fixture.json"
import harness from "./data.fixture.json"
import { generateReport } from "./gitparty"
import { DEFAULT_CONFIG } from "./constants"
import { j2, neue } from "./utils"
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test(`remapConfigData`, (t) => {
  const remapped = remapConfigData({ k: true, x: { color: `red`, matches: [] } })
  t.deepEqual(Object.keys(remapped), [`k`, `x`])
  t.truthy(remapped.k)
})

test(`partyData`, (t) => {
  const config = { collapseMergeCommits: false, collapseAuthors: false }
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

test(`partyData - with collapseAuthors`, (t) => {
  const config = { collapseMergeCommits: false, collapseAuthors: true }
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

test(`partyPrint`, (t) => {
  const config = { collapseMergeCommits: false, collapseAuthors: false, authorLength: 5 }
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

test(`generateReport`, (t) => {
  const commits = harness.filter(({ type }) => type === `commit`)
  const leg = neue(EXAMPLE_LEGEND)
  leg.authorLength = 5
  const output = stripColor(generateReport({}, leg, [commits[commits.length - 1]]))
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
  CONF.j = true // eslint-disable-line
  const output = stripColor(generateReport(CONF, EXAMPLE_LEGEND, [commits[commits.length - 1]]))
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
