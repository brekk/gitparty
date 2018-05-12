import test from "jest-t-assert"
import { reject, filter } from "f-utility"
import {
  groupify,
  filetypes,
  generateAnalysis,
  learnify,
  aliasify,
  changify,
  datify
} from "./per-commit"
import harness from "./data.fixture.json"
import EXAMPLE_LEGEND from "./gitpartyrc.fixture.json"

test(`groupify`, (t) => {
  const isBanner = ({ type }) => type === `banner`
  const noget = reject(isBanner)
  const raw = noget(harness)
  const get = filter(isBanner)
  const grouped = groupify(raw)
  const banners = get(grouped)
  t.is(banners.length, 8)
})
test(`filetypes`, (t) => {
  const grouped = groupify(harness)
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
  const grouped = groupify(harness)
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
test(`learnify`, (t) => {
  const grouped = groupify(harness)
  const output = learnify(EXAMPLE_LEGEND, grouped[2])
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
test(`aliasify`, (t) => {
  const input = {
    authorName: `butts`,
    abbrevHash: `c0ffee`
  }
  const output = aliasify(input)
  t.deepEqual(output, {
    abbrevHash: input.abbrevHash,
    author: input.authorName,
    authorName: input.authorName,
    hash: input.abbrevHash
  })
})
test(`changify`, (t) => {
  const grouped = groupify(harness)
  const output = changify(grouped[2])
  t.deepEqual(output, { M: [`src/gitparty.spec.js`, `src/index.no-wallaby.spec.js`] })
})
test(`datify`, (t) => {
  const now = 1525752938851
  const x = new Date(now)
  const input = { authorDate: x }
  const output = datify(input)
  t.deepEqual(output, {
    authorDate: x,
    ms: now,
    date: `07-05-2018`
  })
})
