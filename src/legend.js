import { pipe, map, join, keys } from 'f-utility'
import chalk from 'chalk'
import { LEGEND } from './constants'
export const printLegend = () =>
  `LEGEND: ` +
  pipe(
    keys,
    map((key) => {
      const value = LEGEND[key]
      return `${chalk.black(value.fn(` ${value.key} `))} = ${key}`
    }),
    join(` `)
  )(LEGEND) +
  `\n`
