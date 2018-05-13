import test from "jest-t-assert"
import stripColor from "strip-color"
import {
  drawToken,
  drawTokens,
  configureAndPrintBanner,
  configureAndPrintCommit,
  colorize
} from "./print"
import { neue } from "./utils"
import { generateAnalysis, groupify } from "./per-commit"
import { remapConfigData } from "./gitparty"
import harness from "./data.fixture.json"
import RAW_LEGEND from "./gitpartyrc.fixture.json"
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test(`drawToken`, (t) => {
  const grouped = groupify(harness)
  const { changes } = grouped[15]
  const analysisFromExample = generateAnalysis(EXAMPLE_LEGEND)
  const analysis = analysisFromExample({ changes })
  const output = stripColor(drawToken(EXAMPLE_LEGEND, analysis, `js`))
  t.is(output, ` J `)
})
test(`drawTokens`, (t) => {
  const grouped = groupify(harness)
  const tokens = drawTokens(EXAMPLE_LEGEND, grouped[grouped.length - 1])
  t.is(tokens, `                  `)
})
test(`configureAndPrintBanner`, (t) => {
  const grouped = groupify(harness)
  const banner = stripColor(configureAndPrintBanner({}, {}, grouped[grouped.length - 4]))
  t.is(
    banner,
    `                  30-04-2018                                                                                            `
  )
})
test(`configureAndPrintCommit`, (t) => {
  const grouped = groupify(harness)
  const banner = stripColor(
    configureAndPrintCommit(
      EXAMPLE_LEGEND,
      { subjectLength: 2, authorLength: 2 },
      grouped[grouped.length - 1]
    )
  )
  t.is(
    banner,
    // eslint-disable-next-line
    ` J  L        C  D  = 1c5ffd2 - in... $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
  )
})
test(`colorize`, (t) => {
  const grouped = groupify(harness)
  const leg = neue(EXAMPLE_LEGEND)
  leg.authorLength = 5
  const out = stripColor(colorize({ authorLength: 5 }, leg, grouped[grouped.length - 1]))
  t.is(
    out,
    // eslint-disable-next-line
    " J  L        C  D     = 1c5ffd2 - initial commit                                        $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml"
  )
})
test(`colorize 2`, (t) => {
  const grouped = groupify(harness)
  const leg = neue(EXAMPLE_LEGEND)
  leg.authorLength = 9
  const out2 = stripColor(colorize({ authorLength: 9 }, leg, grouped[grouped.length - 4]))
  t.is(
    out2,
    `                  30-04-2018                                                                                            `
  )
})
