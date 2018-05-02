import { curry, pipe, entries, reduce, pathOr } from 'f-utility'
import mm from 'micromatch'
import { neue } from './utils'

export const filterFiletypes = curry((types, arr) => mm.some(arr, neue(types)))

export const anyFilesMatchFromObject = curry((changes, filetypes) =>
  pipe(
    entries,
    reduce((agg, [, v]) => agg || filterFiletypes(filetypes, v), false)
  )(changes)
)
const MERGE_WORD = `Merge `
export const isAMergeCommit = (x) =>
  pathOr(``, [`subject`], x).substr(0, 6) === MERGE_WORD
