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
  chain,
  fork
} from 'f-utility'
import chalk from 'chalk'
import { encase } from 'fluture'
// import { trace } from 'xtrace'
import read from 'read-data'
import Future from 'fluture'
import { colorize } from './print'
import { sortByDate, lens } from './utils'
import { isAMergeCommit } from './filters'
import { printLegend } from './legend'
import { collapseSuccessiveSameAuthor } from './grouping'
import { learnify, datify, aliasify, groupify, changify } from './per-commit'
import { DEFAULT_CONFIG } from './constants'

const j2 = (x) => JSON.stringify(x, null, 2)

const gotLog = encase(gitlog)

/* istanbul ignore next */
export const write = curry((output, data) =>
  /* istanbul ignore next */
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
  ) =>
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

/* istanbul ignore next*/
const reader = (x) =>
  new Future((rej, res) => read.yaml(x, (e, d) => (e ? rej(e) : res(d))))

export const festivities = curry((config, lookup, x) =>
  pipe(
    partyData(config, lookup),
    config.j ? j2 : pipe(partyPrint(config, lookup), prependLegend(lookup))
  )(x)
)

const party = curry((config, lookup) =>
  pipe(gotLog, map(festivities(config, lookup)))(config)
)

export const gitparty = curry((config, input) =>
  pipe(
    reader,
    chain(pipe(remapConfigData, party(merge(DEFAULT_CONFIG, config)))),
    fork(console.warn, config.o ? write(config.o) : console.log)
  )(input)
)

export const remapConfigData = pipe(
  map((v) =>
    merge(v, {
      fn: chalk[v.color],
      matches: v.matches.map((w) => w.replace(/^\\/g, ``))
    })
  )
)
