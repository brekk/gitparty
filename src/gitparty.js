import fs from "fs"
import gitlog from "gitlog"
import read from "read-data"
import {
  isString,
  entries,
  filter,
  I,
  join,
  pipe,
  map,
  reject,
  merge,
  curry,
  chain,
  fork,
  isObject,
} from "f-utility"
import chalk from "chalk"
import { encase, encaseN, Future } from "fluture"
import { CHARACTER_LITERALS, ARGV_CONFIG } from "./constants"
import { filterByStringPattern } from "./filters"
import { canonize } from "./alias"
import { colorize } from "./print"
import {
  stripDoubleBackslash,
  sortByDate,
  macroLens,
  j2,
  binaryCallback,
  log,
  warn,
  preferredProp,
  unaryCallbackToFuture,
} from "./utils"
import { isAMergeCommit } from "./filters"
import { printLegend } from "./legend"
import { collapseSuccessiveSameAuthor, insertBanners } from "./grouping"
import {
  addAnalysisPerCommit,
  addTimestampPerCommit,
  addAliasesPerCommit,
  convertStatusAndFilesPerCommit,
} from "./per-commit"
import { DEFAULT_CONFIG } from "./constants"
import { trace } from "xtrace"

const { NEWLINE } = CHARACTER_LITERALS

const gotLog = encase(gitlog)

// fs.access(file, fs.constants.F_OK, (err) => {
//   console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
// });
// const fileIsF = encaseN2(flip(fs.access)(fs.constants.F_OK))
const fileOrError = file =>
  new Future((rej, res) => fs.access(file, fs.constants.F_OK, e => (e ? rej(e) : res(true))))

// const fileExists = file =>
//   new Future((rej, res) => fs.access(file, fs.constants.F_OK, e => (e ? rej(false) : res(true))))

/**
@method perCommit
@param {Object} lookup - the legend
@param {Object} x - the commit object
@return {Object} an updated object
*/
const perCommit = curry((lookup, x) =>
  pipe(
    addTimestampPerCommit,
    addAliasesPerCommit,
    macroLens(convertStatusAndFilesPerCommit, `changes`),
    addAnalysisPerCommit(lookup),
  )(x),
)

/**
@method partyData
@param {Object} config = the configuration object
@param {Object} lookup = the legend object
@param {Array} data - a list of commits
@return {Array} an augmented list of commits
*/
export const partyData = curry((config, lookup, data) => {
  const grab = preferredProp(lookup, config, false)
  const filterMergeCommits = grab(ARGV_CONFIG.alias.m)
  const collapseAuthors = grab(ARGV_CONFIG.alias.a[0])
  const f = grab(ARGV_CONFIG.alias.f)
  const hasStringFilter = f && isString(f) && f.length > 0
  return pipe(
    sortByDate,
    filterMergeCommits ? reject(isAMergeCommit) : I,
    map(perCommit(lookup)),
    hasStringFilter ? filterByStringPattern(f) : I,
    collapseAuthors ? collapseSuccessiveSameAuthor(lookup) : I,
    insertBanners,
  )(data)
})

/**
@method partyPrint
@param {Object} config - the configuration object
@param {Object} lookup - the legend object
@param {Array} input - the commits
@return {string} colorized and stringified commits
*/
export const partyPrint = curry((config, lookup, input) =>
  pipe(
    map(colorize(config, lookup)),
    join(NEWLINE),
  )(input),
)
/**
@method prependLegend
@param {Object} lookup - the legend object
@param {Array} x - the commits
@return {string} colorized and stringified commits
*/
const prependLegend = curry((lookup, x) => printLegend(lookup) + NEWLINE + x)

/**
@method sideEffect
@param {Function} effect - function to call
@param {Object} y - alias structure
@return {any} anything
*/
export const sideEffect = curry((effect, y) =>
  pipe(
    entries,
    map(([k, v]) => (Array.isArray(v) ? v.map(x => effect(k, x)) : effect(k, v))),
  )(y),
)

/**
 @method sideEffectCanonize
 @param {Object} x - alias structure
 @return {null} nothing
 */
/* istanbul ignore next */
export const sideEffectCanonize = sideEffect(canonize)

export const generateReport = curry((config, lookup, data) => {
  const { aliases = {} } = lookup
  // TODO: replace this with something that is a more explicitly managed side-effect
  /* istanbul ignore next */
  sideEffectCanonize(aliases)
  const filteredLookup = filter(z => z && z.matches, lookup)
  return pipe(
    partyData(config, filteredLookup),
    config.j
      ? j2
      : pipe(
          partyPrint(config, filteredLookup),
          prependLegend(filteredLookup),
        ),
  )(data)
})

export const processGitCommits = curry((config, lookup) =>
  pipe(
    gotLog,
    map(generateReport(config, lookup)),
  )(config),
)

// || v.filter)
// filter: v.filter ? v.filter : null
export const remapConfigData = map(
  v =>
    isObject(v) && v.matches
      ? merge(v, {
          fn: chalk[v.color],
          matches: v.matches.map(stripDoubleBackslash),
        })
      : v,
)
/* istanbul ignore next */
export const writeFile = binaryCallback(
  /* istanbul ignore next */
  fs.writeFile.bind(fs),
  /* istanbul ignore next */
  e => log(e || `Wrote to file`),
)
export const reader = unaryCallbackToFuture(read.yaml)

export const processData = curry((config, F) =>
  chain(
    pipe(
      remapConfigData,
      processGitCommits(merge(DEFAULT_CONFIG, config)),
    ),
  )(F),
)

const MAKE_A_GITPARTYRC_FILE = [
  `Unable to find a .gitpartyrc config file in this folder.`,
  `Did you mean to create one with \`${chalk.yellow(`gitparty init`)}\`?`,
].join(" ")

const IT_ONLY_WORKS_IN_GIT_REPOS = `gitparty only works in git repositories! Did you mean to \`${chalk.yellow(
  `git init`,
)}\` first?`

const handleKnownBadThings = e => {
  if (e) {
    if (e.code && e.path && e.code === `ENOENT`) {
      if (e.path.substr(e.path.lastIndexOf(`/`)) === `/.gitpartyrc`) {
        warn(new Error(MAKE_A_GITPARTYRC_FILE))
        return
      } else if (e.path === ".git/index") {
        warn(new Error(IT_ONLY_WORKS_IN_GIT_REPOS))
        return
      }
    }
    // if (e.status)
    warn(e)
  }
}

/* istanbul ignore next */
export const warnWriteOrLog = curry(
  /* istanbul ignore next */
  ({ o }, F) =>
    /* istanbul ignore next */
    fork(handleKnownBadThings, o ? writeFile(o) : log)(F),
)

export const isGitDirectory = dir =>
  fs.access(file, fs.constants.F_OK, err => {
    console.log(`${file} ${err ? "does not exist" : "exists"}`)
  })

/* istanbul ignore next */
export const processAndPrintWithConfig = curry(
  /* istanbul ignore next */
  (config, input) => {
    // console.log(fileExists(".git/index").fork(console.log, console.log), `<<<<<<`)
    /* istanbul ignore next */
    return pipe(
      i => fileOrError(".git/index").and(reader(i)),
      processData(config),
      warnWriteOrLog(config),
    )(input)
  },
)
