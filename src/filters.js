import { curry, pipe, entries, reduce, pathOr } from "f-utility"
import mm from "micromatch"
import { neue } from "./utils"

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
