import { merge } from 'f-utility'
import test from 'jest-t-assert'
import {
  box,
  neue,
  summarize,
  isAMergeCommit,
  aliasProperty,
  lens
} from './utils'

test(`box`, (t) => {
  const input = 420
  t.deepEqual(box(input), [input])
  const input2 = [420]
  t.deepEqual(box(input2), input2)
})

test(`neue`, (t) => {
  const input = { a: 1, b: 2, c: 3 }
  const output = neue(input)
  t.deepEqual(input, output)
  // not same reference
  output.x = 420 // eslint-disable-line fp/no-mutation
  // they're like, different
  t.notDeepEqual(input, output)
  const input2 = [1, 2, 3]
  const output2 = neue(input2)
  t.deepEqual(input2, output2)
  // not same reference
  output2[1] = `x` // eslint-disable-line fp/no-mutation
  t.notDeepEqual(input2, output2)
})

test(`summarize`, (t) => {
  const input = `!@#$%^&*()_1234567890`
  const output = summarize(4, input)
  t.is(output, `!@#$...`)
  const output2 = summarize(10, input)
  t.is(output2, `!@#$%^&*()...`)
  const output3 = summarize(4, `x`)
  t.is(output3, `x      `)
})

test(`isAMergeCommit`, (t) => {
  const output = isAMergeCommit({ subject: `Merge butts` }) //?
  t.truthy(output)
  const output2 = isAMergeCommit({ subject: `No merge butts` }) //?
  t.falsy(output2)
  const output3 = isAMergeCommit({ snandukes: `snandukakis` }) //?
  t.falsy(output3)
})

test(`aliasProperty`, (t) => {
  const NUMBER = Math.round(Math.random() * 1e5)
  const input = { x: NUMBER }
  const output = aliasProperty(`x`, `y`, input)
  t.deepEqual(output, merge(input, { y: input.x }))
  const output2 = aliasProperty(`x`, `y`, { zzz: input.x }) // ?
  t.deepEqual(output2, { zzz: input.x })
})
