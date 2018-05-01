import chalk from 'chalk'
import { curry, padEnd, padStart } from 'f-utility'
import { LEGEND, SUBJECT_LENGTH } from './constants'
import { filetypes } from './per-commit'
import { summarize } from './utils'
export const print = curry(
  (x, fn, token) => (x ? chalk.black(fn(` ${token} `)) : `   `)
)
export const colorize = ({
  date,
  type,
  hash,
  changes,
  subject,
  author,
  analysis
}) => {
  if (type === `banner`) {
    // 29 aligns it to the end of the commit hash
    return chalk.bgWhite(
      chalk.black(padEnd(120, ` `, padStart(29, ` `, date)))
    )
  } else if (type === `commit`) {
    const { style, frontend, backend, assets, devops, tests } = analysis
    const __hash = chalk.yellow(hash)
    const __summary = summarize(SUBJECT_LENGTH, subject)
    const __author = chalk.red(padEnd(20, ` `, author))
    const __style = print(style, LEGEND.style.fn, LEGEND.style.key)
    const __frontend = print(frontend, LEGEND.frontend.fn, LEGEND.frontend.key)
    const __backend = print(backend, LEGEND.backend.fn, LEGEND.backend.key)
    const __assets = print(assets, LEGEND.assets.fn, LEGEND.assets.key)
    const __devops = print(devops, LEGEND.devops.fn, LEGEND.devops.key)
    const __tests = print(tests, LEGEND.tests.fn, LEGEND.tests.key)
    const __analysis = `${__style}${__frontend}${__backend}${__devops}${__assets}${__tests}`
    return `${__analysis} = ${__hash} - ${__summary} $ ${__author} | ${filetypes(
      changes
    ).join(` `)}`
  }
}
