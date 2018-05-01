import gitlog from 'gitlog'
import { join, pipe, map, reject, merge } from 'f-utility'
import { colorize } from './print'
import { isAMergeCommit } from './utils'
import { anyFilesMatchFromObject } from './filters'
import { canonicalize } from './alias'
import {
  collapseSuccessiveSameAuthor,
  createBannersFromGroups,
  groupBy
} from './grouping'
import { TOTAL_COMMITS } from './constants'

const authors = {}
const { getCanon, canonize } = canonicalize(authors)
canonize(`Brekk Bockrath`, `brekk`)

const addChangesObject = (y) => {
  const arrayify = (x) => (file, i) => {
    const status = x.status[i]
    return [status, file]
  }
  const flattenArrays = (a, [k, v]) =>
    merge(a, { [k]: (a[k] || []).concat(v) })
  const {
    authorName: author,
    // authorDate: date,
    authorDateRel: date,
    abbrevHash: hash,
    subject,
    files
  } = y
  const changes = files.map(arrayify(y)).reduce(flattenArrays, {})
  // const changes = pipe(map(arrayify(y)), reduce(flattenArrays, {}))(files)
  return {
    date,
    hash,
    changes,
    subject,
    author
  }
}

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
      style: any(`scss`),
      tests: any(`specs.js`),
      frontend: any([`scss`, `js`, `package.json`]),
      backend: any(`py`),
      assets: any([`jpg`, `png`, `svg`]),
      devops: any([`bin`, `html`, `yml`])
    }
  }
}

const partytrain = pipe(
  // eslint-disable-next-line fp/no-mutating-methods
  (x) => x.sort(({ date }, { date: newDate }) => newDate - date),
  reject(isAMergeCommit),
  map(pipe(addChangesObject, analyze)),
  collapseSuccessiveSameAuthor,
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
