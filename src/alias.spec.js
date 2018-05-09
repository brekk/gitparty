import test from 'jest-t-assert'
import { random } from 'f-utility'
import { alias, getAliasFrom, canonicalize } from './alias'

test(`alias`, (t) => {
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
})

test(`getAliasFrom`, (t) => {
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

test(`canonicalize`, (t) => {
  const number = random.floorMin(0, 10e3)
  const structure = {
    input: number
  }
  const { getCanon, canonize } = canonicalize(structure)
  canonize(`input`, `output`)
  const output = getCanon(`output`)
  t.is(output, `input`)
})
