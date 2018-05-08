import { keys } from 'f-utility'
import test from 'jest-t-assert'
import {
  TOTAL_COMMITS,
  SUBJECT_LENGTH,
  BANNER_LENGTH,
  BANNER_INDENT,
  AUTHOR_LENGTH,
  DEFAULT_FIELDS,
  DEFAULT_CONFIG,
  ARGV_CONFIG
} from './constants'

test(`TOTAL_COMMITS`, (t) => {
  t.is(TOTAL_COMMITS, 100)
})

test(`SUBJECT_LENGTH`, (t) => {
  t.is(SUBJECT_LENGTH, 50)
})

test(`BANNER_LENGTH`, (t) => {
  t.is(BANNER_LENGTH, 120)
})

test(`BANNER_INDENT`, (t) => {
  t.is(BANNER_INDENT, 25)
})

test(`AUTHOR_LENGTH`, (t) => {
  t.is(AUTHOR_LENGTH, 7)
})

test(`DEFAULT_FIELDS`, (t) => {
  t.deepEqual(DEFAULT_FIELDS, [
    `abbrevHash`,
    `subject`,
    `authorName`,
    `authorDate`,
    `authorDateRel`
  ])
})
test(`DEFAULT_CONFIG`, (t) => {
  t.deepEqual(keys(DEFAULT_CONFIG), [
    `collapseMergeCommits`,
    `collapseAuthors`,
    `authorLength`,
    `subjectLength`,
    `bannerLength`,
    `bannerIndent`,
    `json`,
    `repo`,
    `number`,
    `fields`,
    `execOptions`
  ])
})

test(`ARGV_CONFIG`, (t) => {
  t.deepEqual(keys(ARGV_CONFIG), [`alias`])
})
