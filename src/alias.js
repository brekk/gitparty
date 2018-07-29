import { curry, merge } from "f-utility"

/**
@method alias
@param {Object} object - an object to store aliases in
@param {string} original - a string
@param {string} alt - the alias
@returns null
*/
export const alias = curry((object, original, alt) => {
  /* istanbul ignore next */
  if (!object[alt]) {
    /* istanbul ignore next */
    object[alt] = original // eslint-disable-line fp/no-mutation
  }
  /* istanbul ignore next */
  if (!object[original]) {
    /* istanbul ignore next */
    object[original] = object[alt] // eslint-disable-line fp/no-mutation
  }
})

/**
 @method pureAliasedListeners
 @param {Function} subscriber - a callback function
 @returns {Object} current
 */
export const pureAliasedListeners = subscriber =>
  curry((original, alt, seed) => {
    const emitted = merge(seed, { [alt]: original, [original]: original })
    subscriber(emitted)
    return emitted
  })

/**
@method getAliasFrom
@param {Object} object - an object to pull aliases from
@param {string} key - a key to look up
@returns {*} whatever the lookup resulted in or the key itself
*/
export const getAliasFrom = curry(
  (object, key) => (object && object[key]) || key
)

/**
@method canonicalize
@param {Object} object - an object to store aliases in and pull aliases from
@returns {Object} an object with canonize and getCanon on it
*/
export const canonicalize = object => ({
  canonize: (a, b = a) => alias(object, a, b),
  getCanon: getAliasFrom(object)
})

const authors = {}
export const { getCanon, canonize } = canonicalize(authors)
