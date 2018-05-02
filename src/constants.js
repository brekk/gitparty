import chalk from 'chalk'
export const LEGEND = {
  js: {
    key: `J`,
    fn: chalk.bgBlue,
    matches: [`src/*.js`]
  },
  lint: {
    key: `L`,
    fn: chalk.bgMagenta,
    matches: [`**/.eslintrc`]
  },
  tests: {
    key: `T`,
    fn: chalk.bgRed,
    matches: [`**/*.spec.js`]
  },
  config: {
    key: `C`,
    fn: chalk.bgCyan,
    matches: [`**/*.json`, `**/*.yml`, `**/rollup/*`, `**/webpack*`, `**/^.*`]
  },
  dependencies: {
    key: `D`,
    fn: chalk.bgYellow,
    matches: [`**/package.json`, `**/yarn.lock`]
  }
}
export const TOTAL_COMMITS = 100
export const SUBJECT_LENGTH = 50
export const BANNER_LENGTH = 120
export const BANNER_INDENT = 25
export const AUTHOR_LENGTH = 7
