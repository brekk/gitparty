import {
  curry,
  merge,
  fromPairs,
  entries,
  pipe,
  keys,
  reduce,
  map
} from 'f-utility'
import { uniq } from 'lodash'
import time from 'dayjs'
import { groupBy } from 'lodash/fp'
import { aliasProperty } from './utils'
import { anyFilesMatchFromObject } from './filters'
import { createBannersFromGroups } from './grouping'
import { getCanon } from './alias'

// import { e1 } from 'entrust'
// const lastIndexOf = e1(`lastIndexOf`)

export const groupify = pipe(groupBy(`date`), createBannersFromGroups)

const grabAfterLastDot = map((str) => str.substr(str.lastIndexOf(`.`) + 1))

export const filetypes = (changes) =>
  pipe(
    keys,
    reduce((list, key) => list.concat(grabAfterLastDot(changes[key])), []),
    uniq,
    // eslint-disable-next-line fp/no-mutating-methods
    (x) => x.sort()
  )(changes)

export const generateAnalysis = curry((lookup, { changes }) =>
  pipe(
    entries,
    map(([k, { matches }]) => [k, anyFilesMatchFromObject(changes, matches)]),
    fromPairs
  )(lookup)
)

export const learnify = curry((lookup, raw) =>
  merge(raw, {
    type: `commit`,
    author: getCanon(raw.author),
    analysis: generateAnalysis(lookup, raw)
  })
)

export const aliasify = pipe(
  aliasProperty(`authorName`, `author`),
  aliasProperty(`abbrevHash`, `hash`)
)
export const changify = (y) => {
  const { files } = y
  const arrayify = (x) => (file, i) => {
    const status = x.status[i]
    return [status, file]
  }
  const flattenArrays = (a, [k, v]) =>
    merge(a, { [k]: (a[k] || []).concat(v) })
  return files.map(arrayify(y)).reduce(flattenArrays, {})
}
export const datify = (x) => {
  const { authorDate } = x
  const rel = time(authorDate)
  const ms = rel.valueOf()
  const date = rel.format(`DD-MM-YYYY`)
  return merge(x, { ms, date })
}
