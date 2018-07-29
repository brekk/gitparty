import {
  isArray,
  curry,
  pipe,
  entries,
  reduce,
  pathOr,
  split,
  map,
  filter,
  every,
  path
} from "f-utility"
import mm from "micromatch"
import { neue, indexAny } from "./utils"
import { getCanon } from "./alias"

/**
@method matchesWildcards
@param {Array} wildcards - a list of wildcards to match against
@param {Array} list - a list of files to compare against
@return {boolean} whether any of the files match any of the wildcards
*/
export const matchesWildcards = curry((wildcards, list) =>
  mm.some(list, neue(wildcards))
)

/**
@method anyFilesMatchFromObject
@param {Object} changes - an object whose keys are lists of files
@param {Array} wildcards - a list of wildcards
@return {boolean} whether any keys on the changes object match any of the wildcards
*/
export const anyFilesMatchFromObject = curry((changes, wildcards) =>
  pipe(
    entries,
    reduce((agg, [, v]) => agg || matchesWildcards(wildcards, v), false)
  )(changes)
)
const MERGE_WORD = `Merge `
/**
@method isAMergeCommit
@param {Object} x - an object with an optional subject
@returns {boolean} whether the given object's subject starts with 'Merge '
*/
export const isAMergeCommit = x =>
  pathOr(``, [`subject`], x).substr(0, 6) === MERGE_WORD

export const stringMatcher = curry((commit, [k, v]) => {
  if (v === `true` || v === `false`) {
    v = !!v // eslint-disable-line fp/no-mutation
  }
  const dotted = indexAny(`.`, k)
  if (dotted || (commit && commit[k])) {
    const value = dotted ? path(k.split(`.`), commit) : commit[k]
    // authors are magical
    if (k === `author` || k === `authorName`) {
      return getCanon(value) === getCanon(v)
    }
    // asterisks turn on minimatch mode for arrays
    if (isArray(value) && indexAny(`*`, v)) {
      return mm.some(value, v)
    }
    // a ~ suffix will do looser matching
    if (/~$/.test(v)) {
      return indexAny(v.replace(/~/, ``), value.toLowerCase())
    }
    return value === v
  }
})
/**
 @method filterByStringPattern
 @param {string} f - colon and hash character delimited string (e.g. 'a:1#b:2')
 @param {Array} commits - an array of commits
 @return {Array} a potentially filtered array of commits
 */
export const filterByStringPattern = curry((filterPattern, commits) => {
  /**
   @method matcher
   @private
   @param {Object} commit - a commit object
   @return {boolean} whether there's a match
   */
  const matcher = commit =>
    pipe(
      split(`#`),
      map(split(`:`)),
      every(stringMatcher(commit))
    )(filterPattern)
  return filter(matcher, commits)
})
