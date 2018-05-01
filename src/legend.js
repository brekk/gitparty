import { map, join } from 'f-utility'
import chalk from 'chalk'
export const printLegend = () =>
  `LEGEND: ` +
  pipe(
    values,
    map((value) => `${chalk.black(value.fn(` ${value.key} `))} = ${key}`),
    join(` `)
  )(LEGEND) +
  `\n`
