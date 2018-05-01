import { pipe, keys, reduce, map } from 'f-utility'
// import { e1 } from 'entrust'
import { uniq } from 'lodash'
// const lastIndexOf = e1(`lastIndexOf`)

export const filetypes = (changes) =>
  pipe(
    keys,
    reduce((list, key) => {
      return list.concat(
        map((file) => file.substr(file.lastIndexOf(`.`) + 1), changes[key])
      )
    }, []),
    uniq,
    // eslint-disable-next-line fp/no-mutating-methods
    (x) => x.sort()
  )(changes)
