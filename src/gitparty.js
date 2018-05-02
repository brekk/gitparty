import gitlog from 'gitlog'
import {
  I,
  join,
  pipe,
  map,
  reject,
  merge,
  curry,
  fromPairs,
  entries
} from 'f-utility'
// import { trace } from 'xtrace';
import { groupBy } from 'lodash/fp'
import time from 'dayjs'
import {
  LEGEND,
  AUTHOR_LENGTH,
  SUBJECT_LENGTH,
  BANNER_INDENT,
  BANNER_LENGTH
} from './constants'
import { colorize } from './print'
import { sortByDate, lens, aliasProperty } from './utils'
import { isAMergeCommit, anyFilesMatchFromObject } from './filters'
import { canonicalize } from './alias'
import { printLegend } from './legend'
import { createBannersFromGroups } from './grouping'
import { TOTAL_COMMITS } from './constants'

const authors = {}
const { getCanon, canonize } = canonicalize(authors)
canonize(`brekk`, `Brekk Bockrath`)

const collapseSuccessiveSameAuthor = (x) => {
  const y = []
  let prev = false
  let lastIndex = false
  for (let i = 0; i < x.length; i++) {
    let curr = x[i]
    if (i > 0 && lastIndex && prev && curr && prev.author === curr.author) {
      y[y.length - 1] = merge(prev, {
        subject: `[+] ` + prev.subject + ` && ` + curr.subject,
        changes: merge(prev.changes, curr.changes),
        analysis: {
          style: prev.analysis.style || curr.analysis.style,
          tests: prev.analysis.tests || curr.analysis.tests,
          frontend: prev.analysis.frontend || curr.analysis.frontend,
          backend: prev.analysis.backend || curr.analysis.backend,
          assets: prev.analysis.assets || curr.analysis.assets,
          devops: prev.analysis.devops || curr.analysis.devops
        }
      })
    } else {
      y.push(curr)
    }
    prev = curr
    lastIndex = i
  }
  return y
}

const aliasify = pipe(
  aliasProperty(`authorName`, `author`),
  aliasProperty(`abbrevHash`, `hash`)
)
const addChanges = (y) => {
  const { files } = y
  const arrayify = (x) => (file, i) => {
    const status = x.status[i]
    return [status, file]
  }
  const flattenArrays = (a, [k, v]) =>
    merge(a, { [k]: (a[k] || []).concat(v) })
  return files.map(arrayify(y)).reduce(flattenArrays, {})
}
const datify = (x) => {
  const { authorDate } = x
  const rel = time(authorDate)
  const ms = rel.valueOf()
  const date = rel.format(`DD-MM-YYYY`)
  return merge(x, { ms, date })
}

const addChangesObject = lens(addChanges, `changes`)

const generateAnalysis = curry((lookup, { changes }) =>
  pipe(
    entries,
    map(([k, { matches }]) => [k, anyFilesMatchFromObject(changes, matches)]),
    fromPairs
  )(lookup)
)

const analyze = curry((lookup, raw) =>
  merge(raw, {
    type: `commit`,
    author: getCanon(raw.author),
    analysis: generateAnalysis(lookup, raw)
  })
)

const groupify = pipe(groupBy(`date`), createBannersFromGroups)

const partytrain = curry((config, lookup, data) =>
  pipe(
    sortByDate,
    config.collapseMergeCommits ? reject(isAMergeCommit) : I,
    map(pipe(datify, aliasify, addChangesObject, analyze(lookup))),
    config.collapseAuthors ? collapseSuccessiveSameAuthor : I,
    groupify,
    // (x) => JSON.stringify(x, null, 2)
    map(colorize(config, lookup)),
    join(`\n`)
  )(data)
)
const DEFAULT_CONFIG = {
  collapseMergeCommits: false,
  collapseAuthors: false,
  authorLength: AUTHOR_LENGTH,
  subjectLength: SUBJECT_LENGTH,
  bannerLength: BANNER_LENGTH,
  bannerIndent: BANNER_INDENT,
  repo: __dirname,
  number: TOTAL_COMMITS,
  fields: [
    `abbrevHash`,
    `subject`,
    `authorName`,
    `authorDate`,
    `authorDateRel`
  ],
  execOptions: { maxBuffer: 1000 * 1024 }
}

export const gitparty = curry((lookup, gitConfig) =>
  gitlog(gitConfig, (e, d) => {
    if (e) return console.log(e)
    console.log(printLegend(lookup))
    console.log(partytrain(gitConfig, lookup, d))
  })
)

gitparty(LEGEND, DEFAULT_CONFIG)
