import test from 'jest-t-assert'
import {
  groupify,
  filetypes,
  generateAnalysis,
  learnify,
  aliasify,
  changify,
  datify
} from './per-commit'
import harness from './data.fixture.json'
import EXAMPLE_LEGEND from './gitpartyrc.fixture.json'

test(`groupify`, (t) => {
  const grouped = groupify(harness)
  const one = grouped[0]
  t.deepEqual(one, {
    date: `07-05-2018`,
    type: `banner`
  })
  const six = grouped[6]
  t.deepEqual(six, {
    date: `02-05-2018`,
    type: `banner`
  })
  const twelve = grouped[12]
  t.deepEqual(twelve, {
    date: `01-05-2018`,
    type: `banner`
  })
  const twentyTwo = grouped[22]
  t.deepEqual(twentyTwo, {
    date: `30-04-2018`,
    type: `banner`
  })
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
    js: true,
    lint: false,
    tests: true,
    config: true,
    dependencies: true,
    gitpartyrc: false
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
    status: [`R100`, `D`, `M`, `M`],
    files: [
      `.gitpartyrc`,
      `config-default.yml`,
      `src/gitparty.js`,
      `src/print.js`
    ],
    abbrevHash: `fa928f4`,
    subject: `gitpartyrc`,
    authorName: `brekk`,
    authorDate: `2018-05-07 08:13:02 -0700`,
    authorDateRel: `12 hours ago`,
    ms: 1525705982000,
    date: `07-05-2018`,
    author: `brekk`,
    hash: `fa928f4`,
    changes: {
      R100: [`.gitpartyrc`],
      D: [`config-default.yml`],
      M: [`src/gitparty.js`, `src/print.js`]
    },
    type: `commit`,
    analysis: {
      js: true,
      lint: false,
      tests: false,
      gitpartyrc: true,
      config: false,
      dependencies: false
    }
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
  t.deepEqual(output, {
    R100: [`.gitpartyrc`],
    D: [`config-default.yml`],
    M: [`src/gitparty.js`, `src/print.js`]
  })
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
