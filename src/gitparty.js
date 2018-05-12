// import path from 'path'
import gitlog from "gitlog"
import { filter, I, join, pipe, map, reject, merge, curry, chain, fork, isObject } from "f-utility"
import chalk from "chalk"
import { encase } from "fluture"
import { trace } from "xtrace"
import { colorize } from "./print"
import { sortByDate, lens, j2, writeFile, log, warn, reader } from "./utils"
import { isAMergeCommit } from "./filters"
import { printLegend } from "./legend"
import { collapseSuccessiveSameAuthor } from "./grouping"
import { learnify, datify, aliasify, groupify, changify } from "./per-commit"
import { DEFAULT_CONFIG } from "./constants"

const gotLog = encase(gitlog)

export const partyData = curry(({ collapseMergeCommits, collapseAuthors }, lookup, data) =>
  pipe(
    sortByDate,
    collapseMergeCommits ? reject(isAMergeCommit) : I,
    map(pipe(datify, aliasify, lens(changify, `changes`), learnify(lookup))),
    collapseAuthors ? collapseSuccessiveSameAuthor : I,
    groupify
  )(data)
)
export const partyPrint = curry((config, lookup, input) =>
  pipe(map(colorize(config, lookup)), join(`\n`))(input)
)
const prependLegend = curry((lookup, x) => printLegend(lookup) + `\n` + x)

export const generateReport = curry((config, lookup, data) => {
  const { collapseMergeCommits: a, collapseAuthors: x } = config
  const { collapseMergeCommits: b, collapseAuthors: y } = lookup
  const collapseMergeCommits = !!(b || a)
  const collapseAuthors = !!(y || x)
  const filteredLookup = filter((z) => z && z.matches, lookup)
  return pipe(
    // object data
    partyData({ collapseMergeCommits, collapseAuthors }, filteredLookup),
    // string data
    config.j ? j2 : pipe(partyPrint(config, filteredLookup), prependLegend(filteredLookup))
  )(data)
})

export const processGitCommits = curry((config, lookup) =>
  pipe(gotLog, map(generateReport(config, lookup)))(config)
)

export const remapConfigData = pipe(
  map(
    (v) =>
      isObject(v) ?
        merge(v, {
          fn: chalk[v.color],
          matches: v.matches.map((w) => w.replace(/^\\/g, ``))
        }) :
        v
  )
)

export const processAndPrintWithConfig = curry((config, input) =>
  pipe(
    reader,
    chain(pipe(remapConfigData, processGitCommits(merge(DEFAULT_CONFIG, config)))),
    fork(warn, config.o ? writeFile(config.o) : log)
  )(input)
)
