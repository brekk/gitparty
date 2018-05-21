import { I, merge, curry, padEnd, prop } from "f-utility"
// import { trace } from "xtrace"
import Future from "fluture"

export const unaryCallbackToFuture = curry(
  (fn, x) => new Future((rej, res) => fn(x, (e, d) => (e ? rej(e) : res(d))))
)

export const log = console.log // eslint-disable-line no-console
export const warn = console.warn // eslint-disable-line no-console
/**
@method box
@param {*} x - anything
@return {Array} something in an array
*/
export const box = (x) => (Array.isArray(x) ? x : [x])
/**
@method neue
@param {Object|Array} x - something that might be an array or an object
@return {Object|Array} a cloned copy of said array or object
*/
export const neue = (x) => (x && Array.isArray(x) ? [].concat(x) : merge({}, x))

/**
@method summarize
@param {number} limit - the max length of the string, + 3
@return {string} a summarized string, within the goal limits + 3
*/
export const summarize = curry((limit, str) =>
  padEnd(limit + 3, ` `, str.substr(0, limit) + `${str.length > limit ? `...` : ``}`)
)

/**
@method aliasProperty
@param {string} property - a string property key
@param {string} propAlias - a string property key alias
@param {Object} x - some object
@return {Object} object with aliased property, or no change
*/
export const aliasProperty = curry(
  (property, propAlias, x) =>
    typeof x[property] !== `undefined` ? merge(x, { [propAlias]: x[property] }) : neue(x)
)

/**
@method j2
@param {*} x - anything
@return {string} json stringified stuff with a 2 space indent
*/
export const j2 = (x) => JSON.stringify(x, null, 2)

/**
@method lens
@param {Function} fn - a lens function (copy, property) => {}
@param {string} prop - a property to lens
@param {Object} target - an object which has a property to lens
@return {Object} a cloned object with a modified property
*/
export const lens = curry((fn, property, target) => {
  const copy = neue(target)
  return copy && property ? merge(copy, { [property]: fn(copy, copy[property]) }) : copy
})

/**
@method sortByKeyWithWrapper
@param {boolean} ascendingSort - sort ascending?
@param {Function} wrap - a function to wrap the comparitors with
@param {string} key - a key which is shared across both comparitors
@param {Array} arr - an array to be sorted
@return {Array} a sorted array
*/
export const sortByKeyWithWrapper = curry((ascendingSort, wrap, key, arr) =>
  // eslint-disable-next-line fp/no-mutating-methods
  neue(arr).sort(
    ({ [key]: a }, { [key]: b }) => (ascendingSort ? wrap(b) - wrap(a) : wrap(a) - wrap(b))
  )
)

// eslint-disable-next-line fp/no-mutating-methods
export const sortByDate = sortByKeyWithWrapper(true, I, `ms`)
// eslint-disable-next-line require-jsdoc
const tomorrow = (x) => new Date(x)
export const sortByDateKey = sortByKeyWithWrapper(true, tomorrow)
// eslint-disable-next-line require-jsdoc
const prettyPrintDate = (x) =>
  tomorrow(
    x.split(`-`).reverse() // eslint-disable-line fp/no-mutating-methods
  )

// eslint-disable-next-line require-jsdoc
export const sortByDateObject = (k) =>
  // eslint-disable-next-line fp/no-mutating-methods
  k.sort((a, b) => prettyPrintDate(b) - prettyPrintDate(a))
export const sortByAuthorDate = sortByDateKey(`authorDate`)

export const binaryCallback = curry((orig, cb, output, data) => {
  orig(output, data, cb)
})
export const preferredProp = curry((a, b, def, key) => {
  const _a = prop(key, a)
  const _b = prop(key, b)
  return _a || _b || def
})
// eslint-disable-next-line require-jsdoc
export const stripDoubleBackslash = (w) => w.replace(/^\\/g, ``)
