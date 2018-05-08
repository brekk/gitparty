import test from 'jest-t-assert'
import {
  filterFiletypes,
  anyFilesMatchFromObject,
  isAMergeCommit
} from './filters'

test(`isAMergeCommit`, (t) => {
  t.falsy(isAMergeCommit({ subject: `butts` }))
  t.truthy(isAMergeCommit({ subject: `Merge ` }))
})
test(`filterFiletypes`, (t) => {
  t.falsy(filterFiletypes([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.x`]))
  t.truthy(filterFiletypes([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.a`]))
})
test(`anyFilesMatchFromObject`, (t) => {
  const input = {
    M: [`a/b/c/d/e/f.x`]
  }
  t.truthy(anyFilesMatchFromObject(input, [`**/*.x`]))
  t.falsy(anyFilesMatchFromObject(input, [`**/*.b`]))
})
