import { I, merge, curry, pathOr, padEnd } from 'f-utility'
export const box = (x) => (Array.isArray(x) ? x : [x])
export const neue = (x) => (Array.isArray(x) ? [].concat(x) : merge({}, x))
export const summarize = curry((limit, str) =>
  padEnd(
    limit + 3,
    ` `,
    str.substr(0, limit) + `${str.length > limit ? `...` : ``}`
  )
)

export const isAMergeCommit = (x) =>
  pathOr(``, [`subject`], x).substr(0, 6) === `Merge `

export const aliasProperty = curry(
  (prop, propAlias, x) =>
    typeof x[prop] !== `undefined` ?
      merge(x, { [propAlias]: x[prop] }) :
      neue(x)
)

export const lens = curry((fn, prop, target) => {
  const copy = neue(target)
  return copy && prop ? merge(copy, { [prop]: fn(copy, copy[prop]) }) : copy
})

const sortByKeyWithWrapper = curry((ascendingSort, wrap, key, arr) =>
  // eslint-disable-next-line fp/no-mutating-methods
  arr.sort(
    ({ [key]: a }, { [key]: b }) =>
      ascendingSort ? wrap(b) - wrap(a) : wrap(a) - wrap(b)
  )
)
const sortByKey = sortByKeyWithWrapper(true, I)

// export const sortByDate = (x) => x.sort(({ date: b }, { date: a }) => b - a)
export const sortByDate = sortByKey(`date`)
const tomorrow = (x) => new Date(x)
export const sortByDateKey = sortByKeyWithWrapper(true, tomorrow)
const prettyPrintDate = (x) => tomorrow(x.split(`-`).reverse())
export const sortByDateObject = (k) =>
  // eslint-disable-next-line fp/no-mutating-methods
  k.sort((a, b) => prettyPrintDate(b) - prettyPrintDate(a))
export const sortByAuthorDate = sortByDateKey(`authorDate`)
