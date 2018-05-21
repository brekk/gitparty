export const TOTAL_COMMITS = 100
export const SUBJECT_LENGTH = 50
export const BANNER_LENGTH = 120
export const BANNER_INDENT = 28
export const AUTHOR_LENGTH = 7
export const DEFAULT_FIELDS = [`abbrevHash`, `subject`, `authorName`, `authorDate`, `authorDateRel`]

export const DEFAULT_CONFIG = {
  // this is our config
  filterMergeCommits: true,
  collapseAuthors: false,
  authorLength: AUTHOR_LENGTH,
  subjectLength: SUBJECT_LENGTH,
  bannerLength: BANNER_LENGTH,
  bannerIndent: BANNER_INDENT,
  filter: ``,
  json: false,
  // below this line are gitlog configuration
  repo: process.cwd(),
  number: TOTAL_COMMITS,
  fields: DEFAULT_FIELDS,
  execOptions: { maxBuffer: 1000 * 1024 }
}
const numberize = parseInt

export const ARGV_CONFIG = {
  boolean: [`m`, `a`],
  number: [`l`, `i`, `b`, `s`],
  alias: {
    // our configuration
    a: [`collapseAuthors`, `collapse`],
    // a: [`collapse`, `collapseAuthors`],
    b: `bannerLength`,
    c: `config`,
    f: `filter`,
    h: `help`,
    i: `bannerIndent`,
    j: `json`,
    l: `authorLength`,
    m: `filterMergeCommits`,
    o: `output`,
    s: `subjectLength`,
    // gitlog properties, so we use the names they use
    repo: `r`,
    number: [`n`, `totalCommits`]
  }
}
