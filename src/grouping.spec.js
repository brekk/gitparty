import test from "jest-t-assert"
import { groupBy } from "lodash/fp"
import { filter, reject, pipe, map, merge } from "f-utility"
import {
  addAnalysisPerCommit,
  addTimestampPerCommit,
  addAliasesPerCommit,
  convertStatusAndFilesPerCommit
} from "./per-commit"
import { macroLens, sortByDate } from "./utils"
import { remapConfigData } from "./gitparty"
import harness from "./data.fixture.json"
import RAW_LEGEND from "./gitpartyrc.fixture.json"
import raw from "./gitlog.fixture.json"
import {
  insertBanners,
  booleanMerge,
  createBannersFromGroups,
  collapseSuccessiveSameAuthor
} from "./grouping"
/* eslint-disable require-jsdoc */

const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test(`insertBanners`, t => {
  const isBanner = ({ type }) => type === `banner`
  const noget = reject(isBanner)
  const rawCommits = noget(harness)
  const get = filter(isBanner)
  const grouped = insertBanners(rawCommits)
  const banners = get(grouped)
  t.is(banners.length, 8)
})

test(`booleanMerge`, t => {
  const a = {
    one: true,
    two: false,
    three: true,
    four: false
  }
  const b = {
    one: false,
    two: false,
    three: false,
    four: false
  }
  const output = booleanMerge(a, b)
  t.deepEqual(output, {
    one: true,
    two: false,
    three: true,
    four: false
  })
})

test(`collapseSuccessiveSameAuthor`, t => {
  const HASHES = [`fb50fbb`, `fa928f4`, `f9e5c4f`, `925a86e`, `c2e257b`]
  const input = harness.filter(x => HASHES.includes(x.abbrevHash))
  const output = pipe(collapseSuccessiveSameAuthor(EXAMPLE_LEGEND))(input)
  t.is(output.length, 1)
  t.is(output[0].hashes.length, HASHES.length)
  t.deepEqual(output[0].hashes, HASHES)
})

test(`collapseSuccessiveSameAuthor with non-matching authors`, t => {
  const converted = harness.map(
    x => (x.abbrevHash === `fb50fbb` ? merge(x, { authorName: `grubbly` }) : x)
  )
  const HASHES = [`fb50fbb`, `fa928f4`, `f9e5c4f`, `925a86e`, `c2e257b`]
  const input = converted.filter(x => HASHES.includes(x.abbrevHash))
  const output = pipe(collapseSuccessiveSameAuthor(EXAMPLE_LEGEND))(input)
  t.is(output.length, 2)
  t.is(output[1].hashes.length, HASHES.length - 1)
  t.deepEqual(output[1].hashes, HASHES.slice(1))
})

test(`createBannersFromGroups`, t => {
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
    map(
      pipe(
        addTimestampPerCommit,
        addAliasesPerCommit,
        macroLens(convertStatusAndFilesPerCommit, `changes`),
        addAnalysisPerCommit(EXAMPLE_LEGEND)
      )
    ),
    groupBy(`date`),
    createBannersFromGroups
  )(raw.slice(-1))
  t.deepEqual(output, expected)
})
