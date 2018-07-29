import test from "jest-t-assert"
import {
  matchesWildcards,
  anyFilesMatchFromObject,
  isAMergeCommit,
  filterByStringPattern,
  stringMatcher
} from "./filters"
import FIXTURE from "./data.fixture.json"

test(`isAMergeCommit`, t => {
  t.falsy(isAMergeCommit({ subject: `butts` }))
  t.truthy(isAMergeCommit({ subject: `Merge ` }))
})
test(`matchesWildcards`, t => {
  t.falsy(matchesWildcards([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.x`]))
  t.truthy(matchesWildcards([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.a`]))
})
test(`anyFilesMatchFromObject`, t => {
  const input = {
    M: [`a/b/c/d/e/f.x`]
  }
  t.truthy(anyFilesMatchFromObject(input, [`**/*.x`]))
  t.falsy(anyFilesMatchFromObject(input, [`**/*.b`]))
})
test(`filterByStringPattern`, t => {
  const output = filterByStringPattern(`hash:butts`, FIXTURE)
  t.deepEqual(output, [])
  const output2 = filterByStringPattern(`hash:1c5ffd2`, FIXTURE)
  t.deepEqual(output2, [
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

test(`filterByStringPattern - with ~ suffix`, t => {
  const output = filterByStringPattern(`subject:fix~`, FIXTURE)
  t.deepEqual(output, [
    {
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
      changes: {
        M: [`src/gitparty.spec.js`, `src/index.no-wallaby.spec.js`]
      },
      date: `11-05-2018`,
      files: [`src/gitparty.spec.js`, `src/index.no-wallaby.spec.js`],
      hash: `80ca7f7`,
      ms: 1526047814000,
      status: [`M`, `M`],
      subject: `fixed that hilarious problem of the tests never being accurate`,
      type: `commit`
    }
  ])
})

test(`filterByStringPattern - author lookup`, t => {
  const output = filterByStringPattern(`author:brekk`, FIXTURE)
  const hashes = output.map(({ abbrevHash }) => abbrevHash)
  const match = hashes.indexOf(`fb50fbb`)
  const sliced = hashes.slice(match)
  t.not(sliced.length, FIXTURE.length)
  t.is(sliced.length, 20)
})

test(`filterByStringPattern - files with * lookup`, t => {
  const output = filterByStringPattern(`files:src/**/*.spec.js`, FIXTURE)
  const hashes = output.map(({ abbrevHash }) => abbrevHash)
  t.not(hashes.length, FIXTURE.length)
  t.deepEqual(hashes, [
    `80ca7f7`,
    `9bd10f4`,
    `5e131fb`,
    `8a4f3a9`,
    `4661430`,
    `8886271`,
    `fb50fbb`,
    `f3cc824`,
    `08c0a46`
  ])
})

test(`filterByStringPattern - files with multiple cross-sections`, t => {
  const output = filterByStringPattern(`subject:test~#date:10-05-2018`, FIXTURE)
  const hashes = output.map(({ abbrevHash }) => abbrevHash)
  t.not(hashes.length, FIXTURE.length)
  t.is(hashes.length, 2)
  t.deepEqual(hashes, [`9bd10f4`, `5e131fb`])
})

test(`stringMatcher`, t => {
  const first = FIXTURE.filter(({ type }) => type === `commit`)[0]
  const result = stringMatcher(first, [`analysis.js`, `true`])
  t.truthy(result)
  const result2 = stringMatcher(first, [`analysis.dependencies`, `false`])
  t.falsy(result2)
})
