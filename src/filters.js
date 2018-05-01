import { curry, pipe, entries, reduce } from 'f-utility'
import mm from 'micromatch'
// import { trace } from 'xtrace'

export const filterFiletypes = curry((types, arr) => mm(arr, [].concat(types)))
const some = (x) => x.length > 0

export const anyFilesMatchFromObject = curry((changes, filetypes) =>
  pipe(
    // trace(`input`),
    entries,
    reduce((agg, [, v]) => agg || some(filterFiletypes(filetypes, v)), false)
  )(changes)
)
