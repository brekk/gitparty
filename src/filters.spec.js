import test from "jest-t-assert"
import {
  matchesWildcards,
  anyFilesMatchFromObject,
  isAMergeCommit
} from "./filters"

test(`isAMergeCommit`, t => {
  t.falsy(isAMergeCommit({ subject: `butts` }))
  t.truthy(isAMergeCommit({ subject: `Merge ` }))
})
test(`matchesWildcards`, t => {
  t.falsy(matchesWildcards([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.x`]))
  t.truthy(matchesWildcards([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.a`]))
})
test(`anyFilesMatchFromObject`, t => {
  const input = {
    M: [`a/b/c/d/e/f.x`]
  }
  t.truthy(anyFilesMatchFromObject(input, [`**/*.x`]))
  t.falsy(anyFilesMatchFromObject(input, [`**/*.b`]))
})
