import { I, merge, random } from "f-utility"
import test from "jest-t-assert"
import {
  unaryCallbackToFuture,
  box,
  neue,
  summarize,
  aliasProperty,
  macroLens,
  lens,
  sortByKeyWithWrapper,
  j2,
  binaryCallback,
  preferredProp,
  processKeysByLookup
} from "./utils"

/* eslint-disable require-jsdoc */
test.cb(`binaryCallback`, t => {
  // testing fs.writeFile is annoying af, so it's written as a binaryCallback
  const whatever = (a, b, cb) => cb(a, b)
  const callback = (x, y) => {
    t.is(x, one)
    t.is(y, two)
    t.end()
  }
  const one = random.floorMin(1, 100)
  const two = random.floorMin(1, 100)
  binaryCallback(whatever, callback, one, two)
})

test(`box`, t => {
  const input = 420
  t.deepEqual(box(input), [input])
  const input2 = [420]
  t.deepEqual(box(input2), input2)
})

test(`neue`, t => {
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

test(`summarize`, t => {
  const input = `!@#$%^&*()_1234567890`
  const sum = summarize(input)
  const output = sum(4)
  t.is(output, `!@#$...`)
  const output2 = sum(10)
  t.is(output2, `!@#$%^&*()...`)
  const output3 = summarize(`x`, 4)
  t.is(output3, `x      `)
})
test(`aliasProperty`, t => {
  const NUMBER = Math.round(Math.random() * 1e5)
  const input = { x: NUMBER }
  const output = aliasProperty(`x`, `y`, input)
  t.deepEqual(output, merge(input, { y: input.x }))
  const output2 = aliasProperty(`x`, `y`, { zzz: input.x }) // ?
  t.deepEqual(output2, { zzz: input.x })
})

test(`macroLens`, t => {
  const input = { a: 1, b: 2, c: 3 }
  const output = macroLens((w, x) => x * 2, `b`, input) //?
  t.deepEqual(output, { a: 1, b: 4, c: 3 })
  t.notDeepEqual(input, output)
  const output2 = macroLens(I, null, input) //?
  t.deepEqual(input, output2)
})
test(`lens`, t => {
  const input = { a: 1, b: 2, c: 3 }
  const output = lens(x => x * 2, `b`, input) //?
  t.deepEqual(output, { a: 1, b: 4, c: 3 })
  t.notDeepEqual(input, output)
  const output2 = lens(I, null, input) //?
  t.deepEqual(input, output2)
})

test(`sortByKeyWithWrapper`, t => {
  const list = [{ x: 1, y: `one` }, { x: 2, y: `two` }]
  const sorted = sortByKeyWithWrapper(false, I, `x`, list)
  t.deepEqual(sorted[0], { x: 1, y: `one` })
  const sorted2 = sortByKeyWithWrapper(true, I, `x`, list)
  t.deepEqual(sorted2[0], { x: 2, y: `two` })
})

test(`j2`, t => {
  const input = { a: 1, b: 2 }
  const output = j2(input)
  t.is(output, JSON.stringify(input, null, 2))
})

test.cb(`unaryCallbackToFuture`, t => {
  const constant = random.floorMin(1, 1e10)
  const backToTheFuture = (x, cb) => cb(null, constant * x)
  const futureWrapped = unaryCallbackToFuture(backToTheFuture)
  futureWrapped(2).fork(I, x => {
    t.is(x, constant * 2)
    t.end()
  })
})
test.cb(`unaryCallbackToFuture, failure`, t => {
  const constant = random.floorMin(1, 1e10)
  const backToTheFuture = (x, cb) => cb(constant * x)
  const futureWrapped = unaryCallbackToFuture(backToTheFuture)
  futureWrapped(2).fork(x => {
    t.is(x, constant * 2)
    t.end()
  }, I)
})
test(`preferredProp`, t => {
  const sourceA = {
    a: 1,
    b: 3,
    c: 5,
    d: 7,
    e: 9,
    name: `sourceA`,
    j: 10,
    k: 11,
    l: 12
  }
  const sourceB = {
    a: 2,
    b: 4,
    c: 6,
    d: 8,
    e: 10,
    name: `sourceB`,
    x: 2,
    y: 4,
    z: 6
  }
  const def = `butts`
  const preffy = preferredProp(sourceA, sourceB, def)
  const output = preffy(`a`)
  t.is(output, 1)
  const output2 = preffy(`x`)
  t.is(output2, 2)
  const output3 = preffy(`butts`)
  t.is(output3, def)
})

test(`processKeysByLookup`, t => {
  const lookupTable = {
    a: a => a * 2,
    b: b => b / 2,
    c: () => 100
  }
  const result = processKeysByLookup(lookupTable, { a: 50, b: 200, c: 1000 })
  t.deepEqual(result, [[`a`, 100], [`b`, 100], [`c`, 100]])
})
/* eslint-enable require-jsdoc */
