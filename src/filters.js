import { curry, pipe, entries, reduce } from 'f-utility'
import mm from 'micromatch'
// import { trace } from 'xtrace'

export const filterFiletypes = curry((types, arr) =>
  mm.some(arr, [].concat(types))
)

export const anyFilesMatchFromObject = curry((changes, filetypes) =>
  pipe(
    entries,
    reduce((agg, [, v]) => agg || filterFiletypes(filetypes, v), false)
  )(changes)
)

export const isAMergeCommit = (x) =>
  pathOr(``, [`subject`], x).substr(0, 6) === `Merge `
