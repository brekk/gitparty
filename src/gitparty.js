import fs from "fs"
import gitlog from "gitlog"
import read from "read-data"
import {
  every,
  split,
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
  isObject
} from "f-utility"
import chalk from "chalk"
import { encase } from "fluture"
// import { trace } from "xtrace"
import { canonize, getCanon } from "./alias"
import { colorize } from "./print"
import {
  stripDoubleBackslash,
  sortByDate,
  lens,
  j2,
  binaryCallback,
  log,
  warn,
  preferredProp,
  unaryCallbackToFuture
} from "./utils"
import { isAMergeCommit } from "./filters"
import { printLegend } from "./legend"
import { collapseSuccessiveSameAuthor, insertBanners } from "./grouping"
import {
  addAnalysisPerCommit,
  addTimestampPerCommit,
  addAliasesPerCommit,
  convertStatusAndFilesPerCommit
} from "./per-commit"
import { DEFAULT_CONFIG } from "./constants"

const gotLog = encase(gitlog)
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
    lens(convertStatusAndFilesPerCommit, `changes`),
    addAnalysisPerCommit(lookup)
  )(x)
)
/**
@method filterByStringPattern
@param {string} f - colon and hash character delimited string (e.g. 'a:1#b:2')
@param {Array} commits - an array of commits
@return {Array} a potentially filtered array of commits
*/
const filterByStringPattern = curry((f, commits) => {
  /**
  @method matcher
  @private
  @param {Object} commit - a commit object
  @return {boolean} whether there's a match
  */
  const matcher = (commit) =>
    pipe(
      split(`#`),
      map(split(`:`)),
      every(([k, v]) => {
        if (k === `author` || k === `authorName`) {
          return commit && commit[k] && getCanon(commit[k]) === getCanon(v)
        }
        return commit && commit[k] && commit[k] === v
      })
    )(f)
  return filter(matcher, commits)
})

/**
@method partyData
@param {Object} config = the configuration object
@param {Object} lookup = the legend object
@param {Array} data - a list of commits
@return {Array} an augmented list of commits
*/
export const partyData = curry((config, lookup, data) => {
  const grab = preferredProp(lookup, config, false)
  const filterMergeCommits = grab(`filterMergeCommits`)
  const collapseAuthors = grab(`collapseAuthors`)
  const f = grab(`filter`)
  const hasStringFilter = f && isString(f) && f.length > 0
  return pipe(
    sortByDate,
    filterMergeCommits ? reject(isAMergeCommit) : I,
    map(perCommit(lookup)),
    hasStringFilter ? filterByStringPattern(f) : I,
    collapseAuthors ? collapseSuccessiveSameAuthor(lookup) : I,
    insertBanners
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
  pipe(map(colorize(config, lookup)), join(`\n`))(input)
)
/**
@method prependLegend
@param {Object} lookup - the legend object
@param {Array} x - the commits
@return {string} colorized and stringified commits
*/
const prependLegend = curry((lookup, x) => printLegend(lookup) + `\n` + x)

/**
@method sideEffectCanonize
@param {Object} x - alias structure
@return {null} nothing
*/
const sideEffectCanonize = pipe(
  entries,
  map(([k, v]) => (Array.isArray(v) ? v.map((x) => canonize(k, x)) : canonize(k, v)))
)

export const generateReport = curry((config, lookup, data) => {
  const { aliases = {} } = lookup
  // TODO: replace this with something that is a more explicitly managed side-effect
  sideEffectCanonize(aliases)
  const filteredLookup = filter((z) => z && z.matches, lookup)
  return pipe(
    partyData(config, filteredLookup),
    config.j ? j2 : pipe(partyPrint(config, filteredLookup), prependLegend(filteredLookup))
  )(data)
})

export const processGitCommits = curry((config, lookup) =>
  pipe(gotLog, map(generateReport(config, lookup)))(config)
)

export const remapConfigData = pipe(
  map(
    (v) =>
      isObject(v) && v.matches ?
        merge(v, {
          fn: chalk[v.color],
          matches: v.matches.map(stripDoubleBackslash)
        }) :
        v
  )
)
export const writeFile = binaryCallback(fs.writeFile.bind(fs), (e) => log(e || `Wrote to file`))
export const reader = unaryCallbackToFuture(read.yaml)

export const processAndPrintWithConfig = curry((config, input) =>
  pipe(
    reader,
    chain(pipe(remapConfigData, processGitCommits(merge(DEFAULT_CONFIG, config)))),
    fork(warn, config.o ? writeFile(config.o) : log)
  )(input)
)
