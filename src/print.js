import chalk from "chalk"
import { pipe, keys, map, join, curry } from "f-utility"
import { padCharsStart, padCharsEnd } from "lodash/fp"
import { SUBJECT_LENGTH, AUTHOR_LENGTH, BANNER_LENGTH, BANNER_INDENT } from "./constants"
import { filetypes } from "./per-commit"
import { summarize, preferredProp, focusedLens } from "./utils"
import { getCanon } from "./alias"

const BLANK = ` `
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
  return chalk.inverse(padCharsEnd(BLANK, bannerLength, padCharsStart(BLANK, bannerIndent, date)))
})

export const printAuthor = curry(
  (author, length) => pipe(chalk.red, getCanon, padCharsEnd(BLANK, length))(author)
)
const printTypes = pipe(filetypes, join(BLANK))

const prepend = curry((str, str2) => [str, str2].join(BLANK))

export const configureAndPrintCommit = curry((lookup, config, o) => {
  const grab = preferredProp(config, lookup)
  return pipe(
    focusedLens(drawTokens(lookup), `analysis`),
    focusedLens(pipe(chalk.yellow, prepend(`=`)), `hash`),
    focusedLens((author) => pipe(
      grab(AUTHOR_LENGTH),
      printAuthor(author),
      prepend(`$`)
    )(`authorLength`), `author`),
    focusedLens((subject) => pipe(
      grab(SUBJECT_LENGTH),
      summarize(subject),
      prepend(`-`)
    )(`subjectLength`), `subject`),
    focusedLens(pipe(printTypes, prepend(`|`)), `changes`),
    ({ analysis, hash, subject, author, changes }) =>
      [analysis, hash, subject, author, changes].join(BLANK)
  )(o)
})

export const colorize = curry((config, lookup, raw) =>
  (raw.type === `banner` ? configureAndPrintBanner : configureAndPrintCommit)(lookup, config, raw)
)
