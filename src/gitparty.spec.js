import test from 'jest-t-assert'
import stripColor from 'strip-color'
import {
  // write,
  partyData,
  partyPrint,
  // gitparty,
  remapConfigData
} from './gitparty'
import RAW_LEGEND from './gitpartyrc.fixture.json'
import harness from './data.fixture.json'
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
