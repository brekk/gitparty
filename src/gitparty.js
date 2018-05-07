#!/usr/bin/env node
import path from 'path'
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
import { DEFAULT_CONFIG } from './constants'
import { colorize } from './print'
import { sortByDate, lens } from './utils'
import { isAMergeCommit } from './filters'
import { printLegend } from './legend'
import { collapseSuccessiveSameAuthor } from './grouping'
import { learnify, datify, aliasify, groupify, changify } from './per-commit'

const argv = parseArgs(process.argv.slice(2))

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
      authorLength
    },
    lookup,
    data
  ) =>
    pipe(
      sortByDate,
      collapseMergeCommits ? reject(isAMergeCommit) : I,
      map(pipe(datify, aliasify, lens(changify, `changes`), learnify(lookup))),
      collapseAuthors ? collapseSuccessiveSameAuthor : I,
      groupify,
      // after this point everything has been converted to a string
      map(
        colorize(
          { bannerLength, bannerIndent, subjectLength, authorLength },
          lookup
        )
      ),
      join(`\n`)
    )(data)
)

export const gitparty = curry((lookup, gitConfig) => {
  return gitlog(gitConfig, (e, data) => {
    /* eslint-disable no-console */
    if (e) return console.log(e)
    console.log(printLegend(lookup))
    console.log(partytrain(gitConfig, lookup, data))
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
  (e, d) => (e ? console.warn(e) : gitparty(remapConfigData(d), DEFAULT_CONFIG))
)
