import chalk from "chalk"
import { pipe, keys, map, join, curry } from "f-utility"
import { padCharsStart, padCharsEnd } from "lodash/fp"
import { SUBJECT_LENGTH, AUTHOR_LENGTH, BANNER_LENGTH, BANNER_INDENT } from "./constants"
import { filetypes } from "./per-commit"
import { summarize, preferredProp } from "./utils"
import { getCanon } from "./alias"

export const drawToken = curry((lookup, analysis, name) => {
  // cold medina
  const { fn, key } = lookup[name]
  return analysis[name] ? chalk.black(fn(` ${key} `)) : `   `
})

export const drawTokens = curry((lookup, analysis) =>
  pipe(keys, map(drawToken(lookup, analysis)), join(``))(lookup)
)

export const configureAndPrintBanner = curry((lookup, config, { date }) => {
  const grab = preferredProp(config, lookup)
  const bannerIndent = grab(BANNER_INDENT, `bannerIndent`)
  const bannerLength = grab(BANNER_LENGTH, `bannerLength`)
  return chalk.inverse(padCharsEnd(` `, bannerLength, padCharsStart(` `, bannerIndent, date)))
})

export const configureAndPrintCommit = curry(
  (lookup, config, { hash, changes, subject, author, analysis }) => {
    const grab = preferredProp(config, lookup)
    const authorLength = grab(AUTHOR_LENGTH, `authorLength`)
    const subjectLength = grab(SUBJECT_LENGTH, `subjectLength`)
    const _hash = chalk.yellow(hash)
    const _summary = summarize(subjectLength, subject)
    const _author = pipe(chalk.red, getCanon, padCharsEnd(` `, authorLength))(author)
    const _tokens = drawTokens(lookup, analysis)
    const _types = pipe(filetypes, join(` `))(changes)
    return `${_tokens} = ${_hash} - ${_summary} $ ${_author} | ${_types}`
  }
)

export const colorize = curry((config, lookup, raw) =>
  (raw.type === `banner` ? configureAndPrintBanner : configureAndPrintCommit)(lookup, config, raw)
)
