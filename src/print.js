import chalk from 'chalk'
import { pipe, keys, map, join, curry, padEnd, padStart } from 'f-utility'
import { SUBJECT_LENGTH } from './constants'
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
export const colorize = curry(
  (lookup, { date, type, hash, changes, subject, author, analysis }) => {
    if (type === `banner`) {
      // 28 aligns it to the end of the commit hash
      return chalk.bgWhite(
        chalk.black(padEnd(120, ` `, padStart(28, ` `, date)))
      )
    } else if (type === `commit`) {
      // const { style, frontend, backend, assets, devops, tests } = analysis
      const __hash = chalk.yellow(hash)
      const __summary = summarize(SUBJECT_LENGTH, subject)
      const __author = chalk.red(padEnd(20, ` `, author))
      const tokens = autodraw(lookup, analysis)
      return `${tokens} = ${__hash} - ${__summary} $ ${__author} | ${filetypes(
        changes
      ).join(` `)}`
    }
  }
)
