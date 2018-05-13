import fs from "fs"
import { I, merge, curry, pathOr, padEnd, chain } from "f-utility"
import read from "read-data"
import Future from "fluture"

/* istanbul ignore next*/
export const reader = (x) => new Future((rej, res) => read.yaml(x, (e, d) => (e ? rej(e) : res(d))))

export const log = console.log // eslint-disable-line no-console
export const warn = console.warn // eslint-disable-line no-console
export const box = (x) => (Array.isArray(x) ? x : [x])
export const neue = (x) => (x && Array.isArray(x) ? [].concat(x) : merge({}, x))
export const summarize = curry((limit, str) =>
  padEnd(limit + 3, ` `, str.substr(0, limit) + `${str.length > limit ? `...` : ``}`)
)

export const isAMergeCommit = (x) => pathOr(``, [`subject`], x).substr(0, 6) === `Merge `

export const aliasProperty = curry(
  (prop, propAlias, x) =>
    typeof x[prop] !== `undefined` ? merge(x, { [propAlias]: x[prop] }) : neue(x)
)

export const j2 = (x) => JSON.stringify(x, null, 2)

export const lens = curry((fn, prop, target) => {
  const copy = neue(target)
  return copy && prop ? merge(copy, { [prop]: fn(copy, copy[prop]) }) : copy
})

export const sortByKeyWithWrapper = curry((ascendingSort, wrap, key, arr) =>
  // eslint-disable-next-line fp/no-mutating-methods
  neue(arr).sort(
    ({ [key]: a }, { [key]: b }) => (ascendingSort ? wrap(b) - wrap(a) : wrap(a) - wrap(b))
  )
)
const sortByKey = sortByKeyWithWrapper(true, I)

export const sortByDate = (x) => x.sort(({ ms: b }, { ms: a }) => a - b)
// export const sortByDate = sortByKey(`date`)
const tomorrow = (x) => new Date(x)
export const sortByDateKey = sortByKeyWithWrapper(true, tomorrow)
// eslint-disable-next-line fp/no-mutating-methods
const prettyPrintDate = (x) => tomorrow(x.split(`-`).reverse())
export const sortByDateObject = (k) =>
  // eslint-disable-next-line fp/no-mutating-methods
  k.sort((a, b) => prettyPrintDate(b) - prettyPrintDate(a))
export const sortByAuthorDate = sortByDateKey(`authorDate`)

export const binaryCallback = curry((orig, cb, output, data) => {
  orig(output, data, cb)
})
export const writeFile = binaryCallback(fs.writeFile.bind(fs), (e) => log(e || `Wrote to file`))
