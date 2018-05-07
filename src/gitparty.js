#!/usr/bin/env node
import gitlog from 'gitlog'
import { I, join, pipe, map, reject, curry } from 'f-utility'
import { trace } from 'xtrace'
import { LEGEND, DEFAULT_CONFIG } from './constants'
import { colorize } from './print'
import { sortByDate, lens } from './utils'
import { isAMergeCommit } from './filters'
import { canonicalize } from './alias'
import { printLegend } from './legend'
import { collapseSuccessiveSameAuthor } from './grouping'
import { learnify, datify, aliasify, groupify, changify } from './per-commit'

const authors = {}
const { getCanon, canonize } = canonicalize(authors)
canonize(`brekk`, `Brekk Bockrath`)

const partytrain = curry((config, lookup, data) =>
  pipe(
    trace(`input`),
    sortByDate,
    trace(`sorted`),
    config.collapseMergeCommits ? reject(isAMergeCommit) : I,
    trace(`collapsed?`),
    map(pipe(datify, aliasify, lens(changify, `changes`), learnify(lookup))),
    trace(`grouped and changed`),
    config.collapseAuthors ? collapseSuccessiveSameAuthor : I,
    trace(`collapsed again?`),
    groupify,
    trace(`grouped?`),
    // (x) => JSON.stringify(x, null, 2)
    map(colorize(config, lookup)),
    join(`\n`)
  )(data)
)

export const gitparty = curry((lookup, gitConfig) => {
  console.log(gitConfig, `configggggg`)
  return gitlog(gitConfig, (e, d) => {
    /* eslint-disable no-console */
    if (e) return console.log(e)
    console.log(printLegend(lookup))
    console.log(partytrain(gitConfig, lookup, d))
    /* eslint-enable no-console */
  })
})

gitparty(LEGEND, DEFAULT_CONFIG)
