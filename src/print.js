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
export const colorize = curry(
  (
    { bannerLength, bannerIndent, subjectLength, authorLength },
    lookup,
    { date, type, hash, changes, subject, author, analysis }
  ) => {
    if (type === `banner`) {
      return blackOnWhite(
        padEnd(bannerLength, ` `, padStart(bannerIndent, ` `, date))
      )
    } else if (type === `commit`) {
      const _hash = chalk.yellow(hash)
      const _summary = summarize(subjectLength, subject)
      const _author = pipe(chalk.red, padEnd(authorLength, ` `))(author)
      const tokens = autodraw(lookup, analysis)
      const printFiletypes = pipe(filetypes, join(` `))
      return `${tokens} = ${_hash} - ${_summary} $ ${_author} | ${printFiletypes(
        changes
      )}`
    }
  }
)
