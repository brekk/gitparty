import { curry, pathOr, padEnd } from 'f-utility'
export const summarize = curry((limit, str) =>
  padEnd(limit + 3, str.substr(0, limit) + `${str.length > limit ? `...` : ``}`)
)

export const isAMergeCommit = (x) =>
  pathOr(x, [`subject`], ``).substr(0, 6) === `Merge `
