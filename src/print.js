import chalk from "chalk"
import { pipe, keys, map, join, curry, padEnd, padStart } from "f-utility"
import { filetypes } from "./per-commit"
import { summarize } from "./utils"
import { getCanon } from "./alias"

const padify = curry((n, d, x) => padEnd(n, d, padStart(n, d, x)))

export const drawToken = curry((lookup, analysis, name) => {
  // cold medina
  const { fn, key } = lookup[name]
  return analysis[name] ? chalk.black(fn(` ${key} `)) : `   `
})

export const drawTokens = curry((lookup, analysis) =>
  pipe(keys, map(drawToken(lookup, analysis)), join(``))(lookup)
)

export const configureAndPrintBanner = curry(({ bannerLength, bannerIndent }, { date }) =>
  chalk.inverse(padEnd(bannerLength, ` `, padStart(bannerIndent, ` `, date)))
)

export const configureAndPrintCommit = curry(
  (
    lookup,
    { subjectLength, authorLength: length },
    { hash, changes, subject, author, analysis }
  ) => {
    const authorLength = lookup.authorLength || length
    const _hash = chalk.yellow(hash)
    const _summary = summarize(subjectLength, subject)
    const _author = pipe(chalk.red, getCanon, padify(authorLength, ` `))(author)
    const _tokens = drawTokens(lookup, analysis)
    const _types = pipe(filetypes, join(` `))(changes)
    return `${_tokens} = ${_hash} - ${_summary} $ ${_author} | ${_types}`
  }
)

export const colorize = curry(
  (config, lookup, raw) =>
    raw.type === `banner` ?
      configureAndPrintBanner(config, raw) :
      configureAndPrintCommit(lookup, config, raw)
)
