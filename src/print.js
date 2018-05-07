import chalk from 'chalk'
import { pipe, keys, map, join, curry, padEnd, padStart } from 'f-utility'
import { filetypes } from './per-commit'
import { summarize } from './utils'

export const drawTokens = curry((lookup, analysis, name) => {
  const { fn, key } = lookup[name]
  const x = analysis[name]
  return x ? chalk.black(fn(` ${key} `)) : `   `
})

export const autodraw = curry((lookup, analysis) =>
  pipe(keys, map(drawTokens(lookup, analysis)), join(``))(lookup)
)

const blackOnWhite = pipe(chalk.bgWhite, chalk.black)

const configureAndPrintBanner = curry(
  ({ bannerLength, bannerIndent }, { date }) =>
    blackOnWhite(padEnd(bannerLength, ` `, padStart(bannerIndent, ` `, date)))
)

const configureAndPrintCommit = curry(
  (
    lookup,
    { subjectLength, authorLength },
    { hash, changes, subject, author, analysis }
  ) => {
    const _hash = chalk.yellow(hash)
    const _summary = summarize(subjectLength, subject)
    const _author = pipe(chalk.red, padEnd(authorLength, ` `))(author)
    const _tokens = autodraw(lookup, analysis)
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
