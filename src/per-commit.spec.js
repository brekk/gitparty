import test from "jest-t-assert"
import {
  filetypes,
  generateAnalysis,
  addAnalysisPerCommit,
  addAliasesPerCommit,
  convertStatusAndFilesPerCommit,
  addTimestampPerCommit
} from "./per-commit"
import { insertBanners } from "./grouping"
import harness from "./data.fixture.json"
import EXAMPLE_LEGEND from "./gitpartyrc.fixture.json"
/* eslint-disable require-jsdoc */
test(`filetypes`, (t) => {
  const grouped = insertBanners(harness)
  const output = filetypes(grouped[grouped.length - 1].changes)
  t.deepEqual(output, [
    `babelrc`,
    `eslintrc`,
    `gitignore`,
    `js`,
    `json`,
    `lock`,
    `madgerc`,
    `npmignore`,
    `yml`
  ])
})
test(`generateAnalysis`, (t) => {
  const grouped = insertBanners(harness)
  const { changes } = grouped[15]
  const analysisFromExample = generateAnalysis(EXAMPLE_LEGEND)
  const output = analysisFromExample({ changes })
  t.deepEqual(output, {
    config: false,
    dependencies: false,
    gitpartyrc: false,
    js: true,
    lint: false,
    tests: false
  })
  const commit = grouped[grouped.length - 1]
  const output2 = analysisFromExample({ changes: commit.changes })
  t.deepEqual(output2, {
    config: true,
    dependencies: true,
    lint: true,
    js: true,
    tests: false,
    gitpartyrc: false
  })
})
test(`addAnalysisPerCommit`, (t) => {
  const grouped = insertBanners(harness)
  const output = addAnalysisPerCommit(EXAMPLE_LEGEND, grouped[2])
  t.deepEqual(output, {
    abbrevHash: `80ca7f7`,
    analysis: {
      config: false,
      dependencies: false,
      gitpartyrc: false,
      js: true,
      lint: false,
      tests: true
    },
    author: `brekk`,
    authorDate: `2018-05-11 07:10:14 -0700`,
    authorDateRel: `27 hours ago`,
    authorName: `brekk`,
    changes: { M: [`src/gitparty.spec.js`, `src/index.no-wallaby.spec.js`] },
    date: `11-05-2018`,
    files: [`src/gitparty.spec.js`, `src/index.no-wallaby.spec.js`],
    hash: `80ca7f7`,
    ms: 1526047814000,
    status: [`M`, `M`],
    subject: `fixed that hilarious problem of the tests never being accurate`,
    type: `commit`
  })
})
test(`addAliasesPerCommit`, (t) => {
  const input = {
    authorName: `butts`,
    abbrevHash: `c0ffee`
  }
  const output = addAliasesPerCommit(input)
  t.deepEqual(output, {
    abbrevHash: input.abbrevHash,
    author: input.authorName,
    authorName: input.authorName,
    hash: input.abbrevHash
  })
})
test(`convertStatusAndFilesPerCommit`, (t) => {
  const grouped = insertBanners(harness)
  const output = convertStatusAndFilesPerCommit(grouped[2])
  t.deepEqual(output, { M: [`src/gitparty.spec.js`, `src/index.no-wallaby.spec.js`] })
})
test(`addTimestampPerCommit`, (t) => {
  const now = 1525752938851
  const x = new Date(now)
  const input = { authorDate: x }
  const output = addTimestampPerCommit(input)
  t.deepEqual(output, {
    authorDate: x,
    ms: now,
    date: `07-05-2018`
  })
})
/* eslint-enable require-jsdoc */
