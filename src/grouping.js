import { map, filter, I, curry, merge, reduce, keys, pipe } from "f-utility"
import { uniq } from "lodash"
import mergeOptions from "merge-options"
import { groupBy } from "lodash/fp"
import {
  macroLens,
  sortByDate,
  sortByDateObject,
  sortByAuthorDate,
  neue
} from "./utils"
import {
  convertStatusAndFilesPerCommit,
  addAnalysisPerCommit
} from "./per-commit"
import { getCanon } from "./alias"

/**
@method createBannersFromGroups
@param {Object} grouped - a grouped object of commits
@return {Array} ungrouped array with banner objects inserted
*/
export const createBannersFromGroups = grouped =>
  pipe(
    keys,
    sortByDateObject,
    reduce(
      (list, key) =>
        list.concat(
          { date: key, type: `banner` },
          sortByAuthorDate(grouped[key])
        ),
      []
    )
  )(grouped)

/**
@method insertBanners
@param {Array} commits - a list of commit
@return {Array} commits with banners inserted (type: `banner`)
*/
export const insertBanners = pipe(
  groupBy(`date`),
  createBannersFromGroups
)

/**
@method quash
@param {Array} x - an array of inputs
@returns {Array} a unique, filtered array with no null values and no pass-by-referents
*/
const quash = pipe(
  neue,
  filter(I),
  uniq
)
/**
@method booleanMerge
@param {Object} a - an object with boolean keys
@param {Object} b - another object with boolean keys
@returns {Object} an object which is the truthy merge of all keys
*/
export const booleanMerge = curry((x, y) =>
  pipe(
    keys,
    reduce((out, key) => merge(out, { [key]: x[key] || y[key] }), {})
  )(x)
)

/**
@method relearn
@param {Object} commit - an object with a changes property
@return {Object} an updated object
*/
const relearn = curry((lookup, x) =>
  pipe(
    macroLens(convertStatusAndFilesPerCommit, `changes`),
    addAnalysisPerCommit(lookup)
  )(x)
)
/**
@method uniqueFiles
@param {*} _ - anything
@param {Array} files - a list of files
@return {Array} a unique list of files
*/
const uniqueFiles = (_, files) => uniq(files)

/**
@method collapseSuccessiveSameAuthor
@param {Object} lookup - the lookup / legend object
@param {Object} data - the list of commits
@return {Object} a potentially collapsed list of commits
*/
export const collapseSuccessiveSameAuthor = curry((lookup, data) =>
  pipe(
    sortByDate,
    reduce((list, next) => {
      const copy = neue(list)
      const last = copy[copy.length - 1]
      if (next && last) {
        const authorsMatch =
          getCanon(last.authorName) === getCanon(next.authorName)
        const datesMatch = last.date === next.date
        if (authorsMatch && datesMatch) {
          const raw = mergeOptions(last, next)
          const status = [].concat(last.status, next.status)
          const files = [].concat(last.files, next.files)
          const subject = `${last.subject} + ${next.subject}`
          const augmented = mergeOptions(raw, {
            hash: next.hash,
            files,
            subject,
            status,
            multiple: true,
            hashes: quash([].concat(raw.hashes || [], last.hash, next.hash))
          })
          copy[copy.length - 1] = augmented // eslint-disable-line fp/no-mutation
          return sortByDate(copy)
        }
      }
      return sortByDate(copy.concat(next))
    }, []),
    map(
      pipe(
        relearn(lookup),
        macroLens(uniqueFiles, `files`)
      )
    )
  )(data)
)
