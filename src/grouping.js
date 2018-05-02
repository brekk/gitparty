import { merge, curry, reduce, keys, pipe } from 'f-utility'
import { neue } from './utils'

export const groupBy = curry((key, arr) =>
  reduce(
    (agg, raw) => {
      const copy = neue(agg)
      const { [key]: grouping } = raw
      const current = copy[grouping] || []
      const newGroup = current.concat(raw) // eslint-disable-line fp/no-mutation
      return merge(copy, { [grouping]: newGroup })
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
      return list.concat({ date: key, type: `banner` }, grouped[key])
    }, [])
  )(grouped)
