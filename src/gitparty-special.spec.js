import test from 'jest-t-assert'
import stripColor from 'strip-color'
import { festivities, remapConfigData } from './gitparty'
import { DEFAULT_CONFIG } from './constants'
import RAW_LEGEND from './gitpartyrc.fixture.json'
import harness from './data.fixture.json'
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test(`festivities`, (t) => {
  const commits = harness.filter(({ type }) => type === `commit`)
  const output = stripColor(
    festivities(DEFAULT_CONFIG, EXAMPLE_LEGEND, [commits[commits.length - 1]])
  )
  t.is(
    output,
    [
      `LEGEND:  J  = js  L  = lint  T  = tests  G  = gitpartyrc  C  = config  D  = dependencies`,
      ``,
      `               30-04-2018                                                                                               `,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ].join(`\n`)
  )
})
