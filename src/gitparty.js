// import path from 'path'
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
import { encase } from 'fluture'
// import { trace } from 'xtrace'
import { colorize } from './print'
import { sortByDate, lens } from './utils'
import { isAMergeCommit } from './filters'
import { printLegend } from './legend'
import { collapseSuccessiveSameAuthor } from './grouping'
import { learnify, datify, aliasify, groupify, changify } from './per-commit'

const j2 = (x) => JSON.stringify(x, null, 2)

const write = curry((output, data) =>
  fs.writeFile(output, data, (e) => console.log(e || `Wrote to ${output}`))
)

export const partyData = curry(
  (
    {
      // hide any commit whose summary begins with the string 'Merge '
      collapseMergeCommits,
      // collapse successive authors and join the results
      collapseAuthors
    },
    lookup,
    data
  ) => {
    return pipe(
      sortByDate,
      collapseMergeCommits ? reject(isAMergeCommit) : I,
      map(pipe(datify, aliasify, lens(changify, `changes`), learnify(lookup))),
      collapseAuthors ? collapseSuccessiveSameAuthor : I,
      groupify
      // json ? j2 : print,
      // output ? write(output) : I
    )(data)
  }
)
export const partyPrint = curry(
  (
    { bannerIndent, bannerLength, subjectLength, authorLength },
    lookup,
    input
  ) =>
    pipe(
      map(
        colorize(
          { bannerLength, bannerIndent, subjectLength, authorLength },
          lookup
        )
      ),
      join(`\n`)
    )(input)
)
const gotLog = encase(gitlog)

export const gitparty = curry((lookup, config) => {
  gotLog(config)
    .map(
      pipe(
        partyData(config, lookup),
        config.json ? j2 : partyPrint(config, lookup)
      )
    )
    /* eslint-disable no-console */
    .fork(console.warn, config.output ? write : console.log)
})
export const remapConfigData = pipe(
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
