import chalk from "chalk"
import { ternary, filter, I, curry, merge, reduce, keys, pipe, chain } from "f-utility"
import { uniq } from "lodash"
import mergeOptions from "merge-options"
import { sortByDate, sortByDateObject, sortByAuthorDate, neue } from "./utils"
import { getCanon } from "./alias"

export const createBannersFromGroups = (grouped) =>
  pipe(
    keys,
    sortByDateObject,
    reduce(
      (list, key) => list.concat({ date: key, type: `banner` }, sortByAuthorDate(grouped[key])),
      []
    )
  )(grouped)

const quash = pipe(neue, filter(I), uniq)
const smoosh = pipe(neue, uniq)
const orMerge = curry((x, y) =>
  pipe(keys, reduce((out, key) => merge(out, { [key]: x[key] || y[key] }), {}))(x)
)
const conditionalLog = curry((condition, a, b) => ternary(condition, I, console.log)(a, b))
export const collapseSuccessiveSameAuthor = pipe(
  sortByDate,
  reduce((list, next) => {
    const copy = neue(list)
    const last = copy[copy.length - 1]
    if (next && last) {
      const authorsMatch = getCanon(last.authorName) === getCanon(next.authorName)
      const datesMatch = last.date === next.date
      if (authorsMatch && datesMatch) {
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
          hashes: quash([].concat(raw.hashes, last.hash, next.hash))
        })
        copy[copy.length - 1] = augmented
        return sortByDate(copy)
      }
    }
    return sortByDate(copy.concat(next))
  }, [])
)
