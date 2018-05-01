import chalk from 'chalk'
export const LEGEND = {
  style: { key: `S`, fn: chalk.bgMagenta },
  frontend: { key: `F`, fn: chalk.bgGreen },
  backend: { key: `B`, fn: chalk.bgCyan },
  devops: { key: `D`, fn: chalk.bgYellow },
  tests: { key: `T`, fn: chalk.bgRed },
  assets: { key: `A`, fn: chalk.bgWhite }
}
export const TOTAL_COMMITS = 100
export const SUBJECT_LENGTH = 50
