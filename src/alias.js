import { curry } from 'f-utility'

/* eslint-disable fp/no-mutation */
export const alias = curry((struct, original, alt) => {
  if (!struct[alt]) {
    struct[alt] = original
  }
  if (!struct[original]) {
    struct[original] = struct[alt]
  }
})
export const getAliasFrom = curry((struct, key) => struct[key] || key)
/* eslint-enable fp/no-mutation */
export const canonicalize = (x) => {
  const canonize = (a, b = a) => alias(x, a, b)
  const getCanon = getAliasFrom(x)
  return { canonize, getCanon }
}
