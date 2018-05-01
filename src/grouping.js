import { curry, reduce, assign, keys, pipe } from 'f-utility'

export const groupBy = curry((key, arr) =>
  reduce(
    (agg, raw) => {
      const copy = assign({}, agg)
      const { [key]: grouping } = raw
      copy[grouping] = (copy[grouping] || []).concat(raw) // eslint-disable-line fp/no-mutation
      return copy
    },
    {},
    arr
  )
)

// const getNumber = (x) => Number(x.substr(0, x.indexOf(` `)))

export const createBannersFromGroups = (grouped) =>
  pipe(
    keys,
    // eslint-disable-next-line fp/no-mutating-methods
    (k) => k.sort((a, b) => Date(a) - Date(b)),
    reduce((list, key) => {
      const group = grouped[key]
      return list.concat({ date: key, type: `banner` }, group)
    }, [])
  )(grouped)
