import { curry, merge, fromPairs, entries, pipe, keys, reduce, map } from "f-utility"
import { uniq } from "lodash"
import time from "dayjs"
import { aliasProperty } from "./utils"
import { anyFilesMatchFromObject } from "./filters"
import { getCanon } from "./alias"

/**
@method grabAfterLastDot
@param {Array} strings - an array of strings
@return {Array} a list of potentially truncated strings
*/
const grabAfterLastDot = map((str) => str.substr(str.lastIndexOf(`.`) + 1))

/**
@method filetypes
@param {Object} changes - a changes object, generated during analysis
@return {Array} an array of filetypes
*/
export const filetypes = (changes) =>
  pipe(
    keys,
    reduce((list, key) => list.concat(grabAfterLastDot(changes[key])), []),
    uniq,
    // eslint-disable-next-line fp/no-mutating-methods
    (x) => x.sort()
  )(changes)

/**
@method generateAnalysis
@param {Object} lookup - the legend object
@param {Object} commit - an object with changes
@param {Object} commit.changes - a changes object
@returns {Object} a commit object with an analysis property
*/
export const generateAnalysis = curry((lookup, { changes }) =>
  pipe(
    entries,
    map(([k, { matches }]) => [k, anyFilesMatchFromObject(changes, matches)]),
    fromPairs
  )(lookup)
)

/**
@method addAnalysisPerCommit
@param {Object} lookup - the legend object
@param {Object} raw - the commit object
@return {Object} a standardized "commit" object
*/
export const addAnalysisPerCommit = curry((lookup, raw) =>
  merge(raw, {
    type: `commit`,
    author: getCanon(raw.author),
    analysis: generateAnalysis(lookup, raw)
  })
)

/**
@method addAliasesPerCommit
@param {Object} commit - a commit object
@return {Object} a commit with some aliased properties
*/
export const addAliasesPerCommit = pipe(
  aliasProperty(`authorName`, `author`),
  aliasProperty(`abbrevHash`, `hash`)
)

/**
@method convertStatusAndFilesPerCommit
@param {Object} commit - a commit object
@return {Object} a "changes" object
*/
export const convertStatusAndFilesPerCommit = (commit) => {
  /* eslint-disable require-jsdoc */
  const { files } = commit
  // TODO: rewrite this so we don't have to rely on the i to count
  const arrayify = (x) => (file, i) => {
    const status = x.status[i]
    return [status, file]
  }
  const flattenArrays = (a, [k, v]) => merge(a, { [k]: (a[k] || []).concat(v) })
  return files.map(arrayify(commit)).reduce(flattenArrays, {})
  /* eslint-enable require-jsdoc */
}

/**
@method addTimestampPerCommit
@param {Object} commit - a commit object
@return {Object} a commit object with a timestamp property
*/
export const addTimestampPerCommit = (commit) => {
  const { authorDate } = commit
  const rel = time(authorDate)
  const ms = rel.valueOf()
  const date = rel.format(`DD-MM-YYYY`)
  return merge(commit, { ms, date })
}
