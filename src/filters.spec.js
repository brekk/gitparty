import test from "jest-t-assert"
import {
  matchesWildcards,
  anyFilesMatchFromObject,
  isAMergeCommit,
  filterByStringPattern
} from "./filters"
import harness from "./data.fixture.json"

test(`isAMergeCommit`, (t) => {
  t.falsy(isAMergeCommit({ subject: `butts` }))
  t.truthy(isAMergeCommit({ subject: `Merge ` }))
})
test(`matchesWildcards`, (t) => {
  t.falsy(matchesWildcards([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.x`]))
  t.truthy(matchesWildcards([`**/*.a`, `**/*.b`], [`a/b/c/d/e/f.a`]))
})
test(`anyFilesMatchFromObject`, (t) => {
  const input = {
    M: [`a/b/c/d/e/f.x`]
  }
  t.truthy(anyFilesMatchFromObject(input, [`**/*.x`]))
  t.falsy(anyFilesMatchFromObject(input, [`**/*.b`]))
})

test(`filterByStringPattern`, (t) => {
  const fString = `author:brekk#date:08-05-2018`
  const matching = filterByStringPattern(fString, harness)
  t.deepEqual(Object.keys(matching[0]), [
    `status`,
    `files`,
    `abbrevHash`,
    `subject`,
    `authorName`,
    `authorDate`,
    `authorDateRel`,
    `ms`,
    `date`,
    `author`,
    `hash`,
    `changes`,
    `type`,
    `analysis`
  ])
  t.is(matching.length, 6)
  t.deepEqual(matching.map((x) => x.hash), [
    `9210f41`,
    `f64e517`,
    `aaa4e6c`,
    `40e3dbc`,
    `c7f3eb7`,
    `8886271`
  ])
})
