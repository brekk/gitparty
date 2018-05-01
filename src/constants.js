import chalk from 'chalk'
export const LEGEND = {
  style: {
    key: `S`,
    fn: chalk.bgMagenta,
    matches: [`*.scss`, `*.html`]
  },
  tests: {
    key: `T`,
    fn: chalk.bgRed,
    matches: [`*.spec.js`]
  },
  config: {
    key: `C`,
    fn: chalk.bgCyan,
    matches: [`*.json`, `*.yml`, `*rollup*`, `*webpack*`, `^.*`]
  },
  js: {
    key: `J`,
    fn: chalk.bgYellow,
    matches: [`**/*.js`, `**/package.json`, `**/yarn.lock`]
  }
}
export const TOTAL_COMMITS = 100
export const SUBJECT_LENGTH = 50
export const BANNER_LENGTH = 120
export const BANNER_INDENT = 22
export const AUTHOR_LENGTH = 20
