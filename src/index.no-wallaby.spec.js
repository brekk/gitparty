import path from "path"
import execa from "execa"
import stripColor from "strip-color"
import test from "jest-t-assert"
import { split, pipe } from "f-utility"
// import { j2 } from './utils'

const cleanify = pipe(stripColor, (x) => split(`5e131fb`, x)[1], split(`\n`))

test.cb(`gitparty executable`, (t) => {
  t.plan(1)
  const CLI = path.resolve(__dirname, `../lib/index.js`)
  execa.shell(`node ${CLI}`).then((x) => {
    t.deepEqual(cleanify(x.stdout), [
      // `LEGEND:  J  = js  L  = lint  T  = tests  G  = gitpartyrc  C  = config  D  = dependencies`,
      // ``,
      // `                  10-05-2018                                                                                            `,
      // ` J     T           = 5e131fb - passing tests again                                   $ brekk   | js`,
      ` - passing tests again                                   $ brekk   | js`,
      ` J     T  G  C  D  = 8a4f3a9 - nearing 100% coverage                                 $ brekk   | gitpartyrc js json lock`,
      `                  09-05-2018                                                                                            `,
      ` J  L  T           = 4661430 - added a readme                                        $ brekk   | eslintrc js md png`,
      `                  08-05-2018                                                                                            `,
      ` J                 = 9210f41 - refactor                                              $ brekk   | js`,
      ` J                 = f64e517 - everything futurized but currently requires double... $ brekk   | js`,
      ` J                 = aaa4e6c - more fluturization                                    $ brekk   | js`,
      ` J                 = 40e3dbc - added fluture and clarifying intent                   $ brekk   | js`,
      ` J           C  D  = c7f3eb7 - moving things around for the bin script               $ brekk   | js json`,
      ` J     T     C  D  = 8886271 - this will likely break non-relative tests             $ brekk   | js json lock`,
      `                  07-05-2018                                                                                            `,
      ` J  L  T  G        = fb50fbb - tests                                                 $ brekk   | eslintrc gitpartyrc js json`,
      ` J        G        = fa928f4 - gitpartyrc                                            $ brekk   | gitpartyrc js yml`,
      ` J           C  D  = f9e5c4f - added yaml config                                     $ brekk   | js json lock yml`,
      ` J                 = 925a86e - getting cleaner                                       $ brekk   | js`,
      ` J           C  D  = c2e257b - working again                                         $ brekk   | js json lock yml`,
      `                  02-05-2018                                                                                            `,
      ` J           C  D  = b9d98d9 - process.cwd() over __dirname                          $ brekk   | js json`,
      ` J                 = d9249be - pass lint                                             $ brekk   | js`,
      ` J                 = c5f2766 - added some date grossness for now                     $ brekk   | js`,
      ` J                 = e9569fb - pretty close to ready                                 $ brekk   | js`,
      `                  01-05-2018                                                                                            `,
      ` J     T           = f3cc824 - utils covered                                         $ brekk   | js`,
      ` J     T     C  D  = 08c0a46 - tests!                                                $ brekk   | js json lock`,
      ` J  L              = 56b6a81 - cleanification                                        $ brekk   | eslintrc js`,
      ` J                 = 8ea8fe8 - partial change                                        $ brekk   | js`,
      ` J                 = bb2def9 - getting cleaner, legend can be extricated             $ brekk   | js`,
      ` J                 = 21f377f - legend is almost fully extracted                      $ brekk   | js`,
      ` J           C  D  = 852f7ac - add blob matching, start to clean up legend makery    $ brekk   | js json lock`,
      ` J           C  D  = 322b8d0 - cleanups and more fp                                  $ brekk   | js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J                 = c182937 - commit it while it works, dammit                      $ brekk   | js`,
      ` J           C  D  = 58b0786 - better                                                $ brekk   | js json lock`,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk   | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
})
