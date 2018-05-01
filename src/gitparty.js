import gitlog from 'gitlog'
import { join, curry, pipe, map, reject, merge } from 'f-utility'
import { trace } from 'xtrace'
import time from 'dayjs'
import { colorize } from './print'
import { isAMergeCommit, lens, aliasProperty } from './utils'
import { anyFilesMatchFromObject } from './filters'
import { canonicalize } from './alias'
import { printLegend } from './legend'
import { createBannersFromGroups, groupBy } from './grouping'
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

const analyze = ({ date, hash, changes, subject, author }) => {
  const any = anyFilesMatchFromObject(changes)
  return {
    type: `commit`,
    date,
    hash,
    changes,
    subject,
    author: getCanon(author),
    analysis: {
      style: any(`*.scss`),
      tests: any(`*.specs.js`),
      frontend: any([`scss`, `js`, `package.json`]),
      backend: any(`py`),
      assets: any([`jpg`, `png`, `svg`]),
      devops: any([`*rollup*`, `package.json`, `package-scripts.js`])
    }
  }
}

const partytrain = pipe(
  // eslint-disable-next-line fp/no-mutating-methods
  (x) => x.sort(({ date: a }, { date: b }) => b - a),
  // trace(`sorted`),
  reject(isAMergeCommit),
  // trace(`no merge commits`),
  map(
    pipe(
      datify,
      aliasify,
      // trace(`aliased`),
      addChangesObject,
      // trace(`changed`),
      analyze
    )
  ),
  // trace(`added and analyzed`),
  // collapseSuccessiveSameAuthor,
  groupBy(`date`),
  createBannersFromGroups,
  map(colorize),
  join(`\n`)
)
const DEFAULT_CONFIG = {
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

export const gitparty = (config = DEFAULT_CONFIG) =>
  gitlog(config, (e, d) => {
    if (e) return console.log(e)
    console.log(printLegend())
    console.log(partytrain(d))
  })

gitparty()
