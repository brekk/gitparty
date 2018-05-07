#!/usr/bin/env node
import gitlog from 'gitlog'
import { I, join, pipe, map, reject, curry } from 'f-utility'
// import { trace } from 'xtrace'
import { LEGEND, DEFAULT_CONFIG } from './constants'
import { colorize } from './print'
import { sortByDate, lens } from './utils'
import { isAMergeCommit } from './filters'
// import { canonicalize } from './alias'
import { printLegend } from './legend'
import { collapseSuccessiveSameAuthor } from './grouping'
import { learnify, datify, aliasify, groupify, changify } from './per-commit'

const partytrain = curry((config, lookup, data) => {
  const {
    // hide any commit whose summary begins with the string 'Merge '
    collapseMergeCommits = true,
    // collapse successive authors and join the results
    collapseAuthors = false,
    // grouping banner length
    bannerLength,
    // whitespace before the banner beginning
    bannerIndent,
    // max subject length before ellipsizing...
    subjectLength,
    // minimum space for the author name
    authorLength
  } = config
  return pipe(
    sortByDate,
    collapseMergeCommits ? reject(isAMergeCommit) : I,
    map(pipe(datify, aliasify, lens(changify, `changes`), learnify(lookup))),
    collapseAuthors ? collapseSuccessiveSameAuthor : I,
    groupify,
    // after this point everything is json => string
    map(
      colorize(
        { bannerLength, bannerIndent, subjectLength, authorLength },
        lookup
      )
    ),
    join(`\n`)
  )(data)
})

export const gitparty = curry((lookup, gitConfig) => {
  return gitlog(gitConfig, (e, d) => {
    /* eslint-disable no-console */
    if (e) return console.log(e)
    console.log(printLegend(lookup))
    console.log(partytrain(gitConfig, lookup, d))
    /* eslint-enable no-console */
  })
})

gitparty(LEGEND, DEFAULT_CONFIG)
