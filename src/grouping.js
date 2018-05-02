import { reduce, keys, pipe } from 'f-utility'
import { sortByDateObject, sortByAuthorDate } from './utils'

export const createBannersFromGroups = (grouped) =>
  pipe(
    keys,
    sortByDateObject,
    reduce(
      (list, key) =>
        list.concat(
          { date: key, type: `banner` },
          sortByAuthorDate(grouped[key])
        ),
      []
    )
  )(grouped)
