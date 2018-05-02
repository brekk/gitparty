import { pipe, keys, reduce, map } from 'f-utility'
// import { e1 } from 'entrust'
import { uniq } from 'lodash'
// const lastIndexOf = e1(`lastIndexOf`)

const grabAfterLastDot = map((str) => str.substr(str.lastIndexOf(`.`) + 1))

export const filetypes = (changes) =>
  pipe(
    keys,
    reduce((list, key) => list.concat(grabAfterLastDot(changes[key])), []),
    uniq,
    // eslint-disable-next-line fp/no-mutating-methods
    (x) => x.sort()
  )(changes)
