import { merge, curry, pathOr, padEnd } from 'f-utility'
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
      merge({}, x)
)

export const lens = curry((fn, prop, target) => {
  const copy = merge({}, target)
  if (copy && prop) {
    copy[prop] = fn(copy, copy[prop]) // eslint-disable-line fp/no-mutation
  }
  return copy
})
