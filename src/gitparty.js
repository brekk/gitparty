#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import gitlog from 'gitlog'
import {
  I,
  join,
  pipe,
  map,
  reject,
  merge,
  curry,
  entries,
  fromPairs
} from 'f-utility'
import chalk from 'chalk'
// import { trace } from 'xtrace'
import read from 'read-data'
import parseArgs from 'minimist'
import { DEFAULT_CONFIG, ARGV_CONFIG } from './constants'
import { colorize } from './print'
import { sortByDate, lens } from './utils'
import { isAMergeCommit } from './filters'
import { printLegend } from './legend'
import { collapseSuccessiveSameAuthor } from './grouping'
import { learnify, datify, aliasify, groupify, changify } from './per-commit'

const argv = parseArgs(process.argv.slice(2), ARGV_CONFIG)

const j2 = (x) => JSON.stringify(x, null, 2)

const write = curry((output, data) =>
  fs.writeFile(output, data, (e) => console.log(e || `Wrote to ${output}`))
)

const partytrain = curry(
  (
    {
      // hide any commit whose summary begins with the string 'Merge '
      collapseMergeCommits,
      // collapse successive authors and join the results
      collapseAuthors,
      // grouping banner length
      bannerLength,
      // whitespace before the banner beginning
      bannerIndent,
      // max subject length before ellipsizing...
      subjectLength,
      // minimum space for the author name
      authorLength,
      // use json only
      json,
      // write to a file
      output
    },
    lookup,
    data
  ) => {
    const print = pipe(
      map(
        // after this point everything has been converted to a string
        colorize(
          { bannerLength, bannerIndent, subjectLength, authorLength },
          lookup
        )
      ),
      join(`\n`)
    )
    return pipe(
      sortByDate,
      collapseMergeCommits ? reject(isAMergeCommit) : I,
      map(pipe(datify, aliasify, lens(changify, `changes`), learnify(lookup))),
      collapseAuthors ? collapseSuccessiveSameAuthor : I,
      groupify,
      json ? j2 : print,
      output ? write(output) : I
    )(data)
  }
)

export const gitparty = curry((lookup, gitConfig) => {
  return gitlog(gitConfig, (e, data) => {
    const out = partytrain(gitConfig, lookup, data)
    /* eslint-disable no-console */
    if (e) return console.log(e)
    if (!gitConfig.output) {
      console.log(printLegend(lookup))
      console.log(out)
    }
    /* eslint-enable no-console */
  })
})
const remapConfigData = pipe(
  entries,
  map(([k, v]) => [
    k,
    merge(v, {
      fn: chalk[v.color],
      matches: v.matches.map((w) => w.replace(/^\\/g, ``))
    })
  ]),
  fromPairs
)
read.yaml(
  path.resolve(process.cwd(), argv.config || argv.c || `./.gitpartyrc`),
  (e, d) =>
    e ?
      console.warn(e) :
      gitparty(remapConfigData(d), merge(DEFAULT_CONFIG, argv))
)
