/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */

import test from "jest-t-assert"
import { random, pipe } from "f-utility"
import {
  alias,
  pureAliasedListeners,
  getAliasFrom,
  canonicalize
} from "./alias"

test(`alias`, t => {
  const number = random.floorMin(0, 10e3)
  const structure = {
    input: number
  }
  alias(structure, `input`, `output`)
  const match = {
    input: structure.input,
    output: `input`
  }
  t.deepEqual(structure, match)
  alias(structure, `xxx`, `yyy`)
  t.deepEqual(structure, {
    input: structure.input,
    output: `input`,
    yyy: `xxx`,
    xxx: `xxx`
  })
  alias(structure, `input`, `secret`)
  t.deepEqual(structure, {
    input: structure.input,
    output: `input`,
    yyy: `xxx`,
    xxx: `xxx`,
    secret: `input`
  })
  alias(structure, `test`, `huh`)
  t.deepEqual(structure, {
    input: structure.input,
    output: `input`,
    yyy: `xxx`,
    xxx: `xxx`,
    secret: `input`,
    huh: `test`,
    test: `test`
  })
})

test(`getAliasFrom`, t => {
  const number = random.floorMin(0, 10e3)
  const structure = {
    input: number
  }
  alias(structure, `input`, `output`)
  const pulled = getAliasFrom(structure, `output`)
  t.is(pulled, `input`)
  const pulled2 = getAliasFrom(structure, `xxx`)
  t.is(pulled2, `xxx`)
})

test(`canonicalize`, t => {
  const number = random.floorMin(0, 10e3)
  const structure = {
    input: number
  }
  const { getCanon, canonize } = canonicalize(structure)
  canonize(`input`, `output`)
  canonize(`zibble`)
  const output = getCanon(`output`)
  t.is(output, `input`)
  const output2 = getCanon(`huh`)
  t.is(output2, `huh`)
  t.is(getCanon(`zibble`), `zibble`)
})

test.cb(`pureAliasedListeners`, t => {
  // eslint-disable-next-line fp/no-let
  let i = 0
  const willReceive = updated => {
    // eslint-disable-next-line fp/no-mutation
    i += 1
    if (i === 1) {
      t.deepEqual(updated, {
        robert: `bob`,
        bob: `bob`,
        who: `cares`
      })
    } else if (i === 2) {
      t.deepEqual(updated, {
        brett: `brekk`,
        brekk: `brekk`,
        robert: `bob`,
        bob: `bob`,
        who: `cares`
      })
    } else if (i === 3) {
      t.deepEqual(updated, {
        brad: `brekk`,
        brett: `brekk`,
        brekk: `brekk`,
        robert: `bob`,
        bob: `bob`,
        who: `cares`
      })
    } else if (i === 4) {
      t.deepEqual(updated, {
        breckenridge: `brekk`,
        brad: `brekk`,
        brett: `brekk`,
        brekk: `brekk`,
        robert: `bob`,
        bob: `bob`,
        who: `cares`
      })
    } else if (i === 5) {
      t.deepEqual(updated, {
        breakfast: `brekk`,
        breckenridge: `brekk`,
        brad: `brekk`,
        brett: `brekk`,
        brekk: `brekk`,
        robert: `bob`,
        bob: `bob`,
        who: `cares`
      })
      t.end()
    }
  }
  const setAliasFor = pureAliasedListeners(willReceive)
  const aliased = pipe(
    setAliasFor(`bob`, `robert`),
    setAliasFor(`brekk`, `brett`),
    setAliasFor(`brekk`, `brad`),
    setAliasFor(`brekk`, `breckenridge`),
    setAliasFor(`brekk`, `breakfast`)
  )({ who: `cares` })
  t.deepEqual(aliased, {
    bob: `bob`,
    robert: `bob`,
    brett: `brekk`,
    brad: `brekk`,
    breckenridge: `brekk`,
    breakfast: `brekk`,
    brekk: `brekk`,
    who: `cares`
  })
})

/* eslint-enable valid-jsdoc */
/* eslint-enable require-jsdoc */
