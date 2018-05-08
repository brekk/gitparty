import test from 'jest-t-assert'
import chalk from 'chalk'
import { printLegend, printBlocks } from './legend'

const input = {
  zabble: { key: `Z`, fn: chalk.bgMagenta },
  snipple: { key: `S`, fn: chalk.bgBlue }
}

test(`printBlocks`, (t) => {
  const output = printBlocks(input)
  t.is(
    output,
    chalk.black(chalk.bgMagenta(` Z `)) +
      ` = zabble ` +
      chalk.black(chalk.bgBlue(` S `)) +
      ` = snipple`
  )
})

test(`printLegend`, (t) => {
  const output = printLegend(input)
  t.is(
    output,
    `LEGEND: ` +
      chalk.black(chalk.bgMagenta(` Z `)) +
      ` = zabble ` +
      chalk.black(chalk.bgBlue(` S `)) +
      ` = snipple\n`
  )
})
