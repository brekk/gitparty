import { pipe, map, join, toPairs } from "f-utility"
import chalk from "chalk"

/**
@method printBlocks
@param {Object} analysis - an analysis object
@returns {string} a printed and colored string of analysis blocks
*/
export const printBlocks = pipe(
  toPairs,
  map(([key, value]) => `${chalk.black(value.fn(` ${value.key} `))} = ${key}`),
  join(` `)
)

/**
@method printLegend
@param {Object} lookup - the legend object
@return {string} the lookup as a printed and colored string
*/
export const printLegend = (lookup) => `LEGEND: ${printBlocks(lookup)}\n`
