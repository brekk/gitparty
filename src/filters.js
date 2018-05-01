import { curry, pipe, filter, keys, reduce } from 'f-utility'

export const filterFiletypes = curry((types, arr) => {
  const boxedTypes = Array.isArray(types) ? types : [types]
  return pipe(
    filter((type) => {
      return filter((file) => file.indexOf(type) > -1, arr).length > 0
    })
  )(boxedTypes)
})
const moreThanNone = (x) => x.length > 0

export const anyFilesMatchFromObject = curry((changes, filetypes) => {
  return pipe(
    keys,
    reduce(
      (agg, key) =>
        agg || moreThanNone(filterFiletypes(filetypes, changes[key])),
      false
    )
  )(changes)
})
