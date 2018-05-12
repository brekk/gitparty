import chalk from "chalk"
import { ternary, filter, I, curry, merge, reduce, keys, pipe, chain } from "f-utility"
import { uniq } from "lodash"
import mergeOptions from "merge-options"
import { sortByDateObject, sortByAuthorDate, neue } from "./utils"
const uniquelyTruthy = pipe(filter(I), uniq)

export const createBannersFromGroups = (grouped) =>
  pipe(
    keys,
    sortByDateObject,
    reduce(
      (list, key) => list.concat({ date: key, type: `banner` }, sortByAuthorDate(grouped[key])),
      []
    )
  )(grouped)

const smoosh = pipe(neue, uniq)
const orMerge = curry((x, y) =>
  pipe(keys, reduce((out, key) => merge(out, { [key]: x[key] || y[key] }), {}))(x)
)
const conditionalLog = curry((condition, a, b) => ternary(condition, I, console.log)(a, b))
export const collapseSuccessiveSameAuthor = reduce((list, next) => {
  const clog = I // conditionalLog(false)
  const copy = neue(list)
  const last = copy[copy.length - 1]
  if (next && last) {
    clog(chalk.red(last.hash))
    clog(chalk.inverse(`             ${last.date}                 `))
    clog(chalk.blue(next.hash + `   ?`))
    const authorsMatch = last.authorName === next.authorName
    const datesMatch = last.date === next.date
    if (authorsMatch && datesMatch) {
      clog(`    merging`, (last.hashes || last.hash) + ` + ` + next.hash, copy.length)
      const raw = mergeOptions(last, next)
      const files = smoosh(last.files, next.files)
      const subject = `${last.subject} + ${next.subject}`
      const analysis = orMerge(last.analysis, next.analysis)
      const augmented = mergeOptions(raw, {
        hash: next.hash,
        files,
        subject,
        analysis,
        multiple: true,
        hashes: uniquelyTruthy([].concat(raw.hashes, last.hash, next.hash))
      })
      copy[copy.length - 1] = augmented
      return copy
    }
  }
  clog(`no merge`, copy.length + 1)
  return copy.concat(next)
}, [])
