import path from "path"
import execa from "execa"
import stripColor from "strip-color"
import test from "jest-t-assert"
import { split, pipe } from "f-utility"
// import { j2 } from './utils'

const cleanify = pipe(stripColor, (x) => split(`80ca7f7`, x)[1], split(`\n`))

test.cb(`gitparty executable`, (t) => {
  t.plan(1)
  const CLI = path.resolve(__dirname, `../lib/index.js`)
  execa.shell(`node ${CLI}`).then((x) => {
    t.deepEqual(cleanify(x.stdout), [
      ` - fixed that hilarious problem of the tests never be... $ brekk   | js`,
      `                  10-05-2018                                                                                            `,
      ` J     T  G  C  D  = 8a4f3a9 - committing anything breaks the existing tests :joy... $ brekk   | gitpartyrc js json lock`,
      `                  09-05-2018                                                                                            `,
      ` J  L  T           = 4661430 - added a readme                                        $ brekk   | eslintrc js md png`,
      `                  08-05-2018                                                                                            `,
      ` J     T     C  D  = 8886271 - refactor + everything futurized but currently requ... $ brekk   | js json lock`,
      `                  07-05-2018                                                                                            `,
      ` J  L  T  G  C  D  = 925a86e - tests + gitpartyrc + added yaml config + getting c... $ brekk   | gitpartyrc js json yml`,
      ` J           C  D  = c2e257b - working again                                         $ brekk   | js json lock yml`,
      `                  02-05-2018                                                                                            `,
      ` J           C  D  = e9569fb - process.cwd() over __dirname + pass lint + added s... $ brekk   | js`,
      `                  01-05-2018                                                                                            `,
      ` J  L  T     C  D  = 322b8d0 - utils covered + tests! + cleanification + partial ... $ brekk   | js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J           C  D  = 58b0786 - commit it while it works, dammit + better             $ brekk   | js json lock`,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk   | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
})
