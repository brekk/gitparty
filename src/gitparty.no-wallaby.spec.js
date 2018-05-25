import path from "path"
import test from "jest-t-assert"
import stripColor from "strip-color"
import { I } from "f-utility"
import Future from "fluture"
import { processGitCommits, remapConfigData } from "./gitparty"
import RAW_LEGEND from "./gitpartyrc.fixture.json"
// import harness from "./data.fixture.json"
// import { generateReport } from "./gitparty"
import { DEFAULT_CONFIG } from "./constants"
import { neue } from "./utils"
const EXAMPLE_LEGEND = remapConfigData(RAW_LEGEND)

test.cb(`processGitCommits`, (t) => {
  const CONF = neue(DEFAULT_CONFIG)
  CONF.authorLength = 5 // eslint-disable-line fp/no-mutation
  CONF.repo = path.resolve(__dirname, `..`) // eslint-disable-line fp/no-mutation
  const F = Future.of(EXAMPLE_LEGEND)
  const outputF = F.chain(processGitCommits(CONF))
  outputF.fork(I, (result) => {
    /* eslint-disable max-len */
    t.deepEqual(stripColor(result.split(`d985156`)[1]).split(`\n`), [
      ` - l                                                     $ brekk | js`,
      `                  01-05-2018                                                                                            `,
      ` J     T           = 3deac85 - k                                                     $ brekk | js`,
      ` J     T     C  D  = 90b8cc3 - j                                                     $ brekk | js json lock`,
      ` J  L              = 3787b3e - i                                                     $ brekk | eslintrc js`,
      ` J                 = 6665830 - h                                                     $ brekk | js`,
      ` J                 = 3b2b915 - g                                                     $ brekk | js`,
      ` J                 = 5986a42 - f                                                     $ brekk | js`,
      ` J           C  D  = 758920e - e                                                     $ brekk | js json lock`,
      ` J           C  D  = 8e52357 - d                                                     $ brekk | js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J                 = 43b7fcb - c                                                     $ brekk | js`,
      ` J           C  D  = 75e6d7e - b                                                     $ brekk | js json lock`,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    /* eslint-enable max-len */
    t.end()
  })
})
