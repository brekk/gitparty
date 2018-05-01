import chalk from 'chalk'
import { curry, padEnd, padStart } from 'f-utility'
import { LEGEND, SUBJECT_LENGTH } from './constants'
import { filetypes } from './per-commit'
import { summarize } from './utils'
export const drawToken = curry(
  (x, { fn, key }) => (x ? chalk.black(fn(` ${key} `)) : `   `)
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
    // 28 aligns it to the end of the commit hash
    return chalk.bgWhite(
      chalk.black(padEnd(120, ` `, padStart(28, ` `, date)))
    )
  } else if (type === `commit`) {
    const { style, frontend, backend, assets, devops, tests } = analysis
    const __hash = chalk.yellow(hash)
    const __summary = summarize(SUBJECT_LENGTH, subject)
    const __author = chalk.red(padEnd(20, ` `, author))
    const __style = drawToken(style, LEGEND.style)
    const __frontend = drawToken(frontend, LEGEND.frontend)
    const __backend = drawToken(backend, LEGEND.backend)
    const __assets = drawToken(assets, LEGEND.assets)
    const __devops = drawToken(devops, LEGEND.devops)
    const __tests = drawToken(tests, LEGEND.tests)
    const __analysis = `${__style}${__frontend}${__backend}${__devops}${__assets}${__tests}`
    return `${__analysis} = ${__hash} - ${__summary} $ ${__author} | ${filetypes(
      changes
    ).join(` `)}`
  }
}
