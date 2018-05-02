import { pipe, map, join, toPairs } from 'f-utility'
import chalk from 'chalk'

export const printBlocks = pipe(
  toPairs,
  map(([key, value]) => {
    return `${chalk.black(value.fn(` ${value.key} `))} = ${key}`
  }),
  join(` `)
)

export const printLegend = (lookup) => `LEGEND: ${printBlocks(lookup)}\n`
