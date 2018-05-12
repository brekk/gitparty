import test from "jest-t-assert"
import { groupBy } from "lodash/fp"
import { pipe, map } from "f-utility"
import { learnify, datify, aliasify, changify } from "./per-commit"
import { lens, sortByDate } from "./utils"
import { remapConfigData } from "./gitparty"
import harness from "./data.fixture.json"
import RAW_LEGEND from "./gitpartyrc.fixture.json"
import raw from "./gitlog.fixture.json"
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

import { createBannersFromGroups, collapseSuccessiveSameAuthor } from "./grouping"

test(`collapseSuccessiveSameAuthor`, (t) => {
  const HASHES = [`fb50fbb`, `fa928f4`, `f9e5c4f`, `925a86e`, `c2e257b`]
  const input = harness.filter((x) => HASHES.includes(x.abbrevHash))
  const output = pipe(collapseSuccessiveSameAuthor)(input)
  // console.log(output)
  t.is(output.length, 1)
  t.is(output[0].hashes.length, HASHES.length)
  t.deepEqual(output[0].hashes, HASHES)
})

test(`createBannersFromGroups`, (t) => {
  const expected = [
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
      authorDateRel: `10 days ago`,
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
  ]
  const output = pipe(
    sortByDate,
    map(pipe(datify, aliasify, lens(changify, `changes`), learnify(EXAMPLE_LEGEND))),
    groupBy(`date`),
    createBannersFromGroups
  )(raw.slice(-1))
  t.deepEqual(output, expected)
})
