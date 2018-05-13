export const TOTAL_COMMITS = 100
export const SUBJECT_LENGTH = 50
export const BANNER_LENGTH = 120
export const BANNER_INDENT = 28
export const AUTHOR_LENGTH = 7
export const DEFAULT_FIELDS = [`abbrevHash`, `subject`, `authorName`, `authorDate`, `authorDateRel`]

export const DEFAULT_CONFIG = {
  // this is our config
  collapseMergeCommits: true,
  collapseAuthors: false,
  authorLength: AUTHOR_LENGTH,
  subjectLength: SUBJECT_LENGTH,
  bannerLength: BANNER_LENGTH,
  bannerIndent: BANNER_INDENT,
  json: false,
  // below this line are gitlog configuration
  repo: process.cwd(),
  number: TOTAL_COMMITS,
  fields: DEFAULT_FIELDS,
  execOptions: { maxBuffer: 1000 * 1024 }
}

export const ARGV_CONFIG = {
  alias: {
    // a: `authorLength`,
    s: `subjectLength`,
    b: `bannerLength`,
    i: `bannerIndent`,
    j: `json`,
    o: `output`,
    c: `config`,
    collapse: [`a`, `collapseAuthors`],
    m: `collapseMergeCommits`,
    // gitlog properties, so we use the names they use
    repo: `r`,
    number: [`n`, `totalCommits`],
    fields: `f`
  }
}
