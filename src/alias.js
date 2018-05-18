import { curry } from "f-utility"

/**
@method alias
@param {Object} struct - an object to store aliases in
@param {String} original - a string
@param {String} alt - the alias
@returns null
*/
export const alias = curry((struct, original, alt) => {
  /* eslint-disable fp/no-mutation */
  if (!struct[alt]) {
    struct[alt] = original
  }
  if (!struct[original]) {
    struct[original] = struct[alt]
  }
  /* eslint-enable fp/no-mutation */
})

/**
@method getAliasFrom
@param {Object} struct - an object to pull aliases from
@param {String} key - a key to look up
@returns {*} whatever the lookup resulted in or the key itself
*/
export const getAliasFrom = curry((struct, key) => struct[key] || key)

/**
@method canonicalize
@param {Object} struct - an object to store aliases in and pull aliases from
@returns {Object} an object with canonize and getCanon on it
*/
export const canonicalize = (struct) => ({
  canonize: (a, b = a) => alias(struct, a, b),
  getCanon: getAliasFrom(struct)
})

const authors = {}
export const { getCanon, canonize } = canonicalize(authors)
