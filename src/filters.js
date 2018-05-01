import { curry, pipe, filter, keys, reduce } from 'f-utility'
import mm from 'micromatch'

export const filterFiletypes = curry((types, arr) => {
  return mm([].concat(types), arr)
})
const moreThanNone = (x) => x.length > 0

export const anyFilesMatchFromObject = curry((changes, filetypes) =>
  pipe(
    keys,
    reduce(
      (agg, key) =>
        agg || moreThanNone(filterFiletypes(filetypes, changes[key])),
      false
    )
  )(changes)
)
