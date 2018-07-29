import path from "path"
import execa from "execa"
import stripColor from "strip-color"
import test from "jest-t-assert"
import { split, pipe } from "f-utility"
// import { j2 } from './utils'

const cleanify = pipe(
  stripColor,
  x => split(`80ca7f7`, x)[1],
  split(`\n`)
)
const CLI = path.resolve(__dirname, `../lib/index.js`)

test.cb(`gitparty`, t => {
  t.plan(1)
  execa.shell(`node ${CLI} -l 7 --no-collapse`).then(x => {
    /* eslint-disable max-len */
    t.deepEqual(cleanify(x.stdout), [
      ` - fixed that hilarious problem of the tests never be... $ brekk   | js`,
      `                  10-05-2018                                                                                            `,
      ` J     T           = 9bd10f4 - committing anything breaks the existing tests :joy... $ brekk   | js`,
      ` J     T           = 5e131fb - passing tests again                                   $ brekk   | js`,
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
  /* eslint-enable max-len */
})

test.cb(`gitparty --authorLength 15`, t => {
  t.plan(1)
  execa.shell(`node ${CLI} --authorLength 15`).then(x => {
    /* eslint-disable max-len */
    t.deepEqual(cleanify(x.stdout), [
      ` - fixed that hilarious problem of the tests never be... $ brekk           | js`,
      `                  10-05-2018                                                                                            `,
      ` J     T           = 9bd10f4 - committing anything breaks the existing tests :joy... $ brekk           | js`,
      ` J     T           = 5e131fb - passing tests again                                   $ brekk           | js`,
      ` J     T  G  C  D  = 8a4f3a9 - nearing 100% coverage                                 $ brekk           | gitpartyrc js json lock`,
      `                  09-05-2018                                                                                            `,
      ` J  L  T           = 4661430 - added a readme                                        $ brekk           | eslintrc js md png`,
      `                  08-05-2018                                                                                            `,
      ` J                 = 9210f41 - refactor                                              $ brekk           | js`,
      ` J                 = f64e517 - everything futurized but currently requires double... $ brekk           | js`,
      ` J                 = aaa4e6c - more fluturization                                    $ brekk           | js`,
      ` J                 = 40e3dbc - added fluture and clarifying intent                   $ brekk           | js`,
      ` J           C  D  = c7f3eb7 - moving things around for the bin script               $ brekk           | js json`,
      ` J     T     C  D  = 8886271 - this will likely break non-relative tests             $ brekk           | js json lock`,
      `                  07-05-2018                                                                                            `,
      ` J  L  T  G        = fb50fbb - tests                                                 $ brekk           | eslintrc gitpartyrc js json`,
      ` J        G        = fa928f4 - gitpartyrc                                            $ brekk           | gitpartyrc js yml`,
      ` J           C  D  = f9e5c4f - added yaml config                                     $ brekk           | js json lock yml`,
      ` J                 = 925a86e - getting cleaner                                       $ brekk           | js`,
      ` J           C  D  = c2e257b - working again                                         $ brekk           | js json lock yml`,
      `                  02-05-2018                                                                                            `,
      ` J           C  D  = b9d98d9 - process.cwd() over __dirname                          $ brekk           | js json`,
      ` J                 = d9249be - pass lint                                             $ brekk           | js`,
      ` J                 = c5f2766 - added some date grossness for now                     $ brekk           | js`,
      ` J                 = e9569fb - pretty close to ready                                 $ brekk           | js`,
      `                  01-05-2018                                                                                            `,
      ` J     T           = f3cc824 - utils covered                                         $ brekk           | js`,
      ` J     T     C  D  = 08c0a46 - tests!                                                $ brekk           | js json lock`,
      ` J  L              = 56b6a81 - cleanification                                        $ brekk           | eslintrc js`,
      ` J                 = 8ea8fe8 - partial change                                        $ brekk           | js`,
      ` J                 = bb2def9 - getting cleaner, legend can be extricated             $ brekk           | js`,
      ` J                 = 21f377f - legend is almost fully extracted                      $ brekk           | js`,
      ` J           C  D  = 852f7ac - add blob matching, start to clean up legend makery    $ brekk           | js json lock`,
      ` J           C  D  = 322b8d0 - cleanups and more fp                                  $ brekk           | js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J                 = c182937 - commit it while it works, dammit                      $ brekk           | js`,
      ` J           C  D  = 58b0786 - better                                                $ brekk           | js json lock`,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk           | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
  /* eslint-enable max-len */
})

test.cb(`gitparty --collapse`, t => {
  t.plan(1)
  execa.shell(`node ${CLI} -a`).then(x => {
    /* eslint-disable max-len */
    t.deepEqual(cleanify(x.stdout), [
      ` - fixed that hilarious problem of the tests never be... $ brekk   | js`,
      `                  10-05-2018                                                                                            `,
      ` J     T  G  C  D  = 8a4f3a9 - committing anything breaks the existing tests :joy... $ brekk   | gitpartyrc js json lock`,
      `                  09-05-2018                                                                                            `,
      ` J  L  T           = 4661430 - added a readme                                        $ brekk   | eslintrc js md png`,
      `                  08-05-2018                                                                                            `,
      ` J     T     C  D  = 8886271 - refactor + everything futurized but currently requ... $ brekk   | js json lock`,
      `                  07-05-2018                                                                                            `,
      ` J  L  T  G  C  D  = c2e257b - tests + gitpartyrc + added yaml config + getting c... $ brekk   | eslintrc gitpartyrc js json lock yml`,
      `                  02-05-2018                                                                                            `,
      ` J           C  D  = e9569fb - process.cwd() over __dirname + pass lint + added s... $ brekk   | js json`,
      `                  01-05-2018                                                                                            `,
      ` J  L  T     C  D  = 322b8d0 - utils covered + tests! + cleanification + partial ... $ brekk   | eslintrc js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J  L        C  D  = 1c5ffd2 - commit it while it works, dammit + better + initia... $ brekk   | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
  /* eslint-enable max-len */
})

test.cb(`gitparty -f hash:1c5ffd2 -j`, t => {
  t.plan(1)
  execa.shell(`node ${CLI} -f hash:1c5ffd2 -j`).then(x => {
    /* eslint-disable max-len */
    const y = JSON.parse(x.stdout)
    // eslint-disable-next-line
    y[1].authorDateRel = undefined
    t.deepEqual(y, [
      { date: `30-04-2018`, type: `banner` },
      {
        abbrevHash: `1c5ffd2`,
        analysis: {
          config: true,
          dependencies: true,
          gitpartyrc: false,
          js: true,
          lint: true,
          tests: false
        },
        author: `brekk`,
        authorDate: `2018-04-30 21:13:22 -0700`,
        authorDateRel: undefined,
        authorName: `brekk`,
        changes: {
          A: [
            `.babelrc`,
            `.eslintrc`,
            `.gitignore`,
            `.madgerc`,
            `.npmignore`,
            `circle.yml`,
            `gitparty.js`,
            `package-scripts.js`,
            `package.json`,
            `rollup/config.commonjs.js`,
            `rollup/config.es6.js`,
            `rollup/config.shared.js`,
            `src/alias.js`,
            `src/constants.js`,
            `src/filters.js`,
            `src/gitparty.js`,
            `src/grouping.js`,
            `src/legend.js`,
            `src/per-commit.js`,
            `src/print.js`,
            `src/utils.js`,
            `yarn.lock`
          ]
        },
        date: `30-04-2018`,
        files: [
          `.babelrc`,
          `.eslintrc`,
          `.gitignore`,
          `.madgerc`,
          `.npmignore`,
          `circle.yml`,
          `gitparty.js`,
          `package-scripts.js`,
          `package.json`,
          `rollup/config.commonjs.js`,
          `rollup/config.es6.js`,
          `rollup/config.shared.js`,
          `src/alias.js`,
          `src/constants.js`,
          `src/filters.js`,
          `src/gitparty.js`,
          `src/grouping.js`,
          `src/legend.js`,
          `src/per-commit.js`,
          `src/print.js`,
          `src/utils.js`,
          `yarn.lock`
        ],
        hash: `1c5ffd2`,
        ms: 1525148002000,
        status: [
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`,
          `A`
        ],
        subject: `initial commit`,
        type: `commit`
      }
    ])
    t.end()
  })
  /* eslint-enable max-len */
})

test.cb(`gitparty -j -f "files:**/package.json#date:01-05-2018"`, t => {
  t.plan(1)
  execa
    .shell(`node ${CLI} -j -f "files:**/package.json#date:01-05-2018"`)
    .then(x => {
      const y = JSON.parse(x.stdout)
      t.deepEqual(y, [
        {
          date: `01-05-2018`,
          type: `banner`
        },
        {
          status: [`M`, `D`, `M`, `M`, `M`, `A`, `A`, `A`, `M`],
          files: [
            `package.json`,
            `src/alias.js`,
            `src/constants.js`,
            `src/gitparty.js`,
            `src/utils.js`,
            `src/utils.spec.js`,
            `wallaby.js`,
            `webpack.config.js`,
            `yarn.lock`
          ],
          abbrevHash: `08c0a46`,
          subject: `tests!`,
          authorName: `brekk`,
          authorDate: `2018-05-01 23:13:16 -0700`,
          authorDateRel: `3 months ago`,
          ms: 1525241596000,
          date: `01-05-2018`,
          author: `brekk`,
          hash: `08c0a46`,
          changes: {
            M: [
              `package.json`,
              `src/constants.js`,
              `src/gitparty.js`,
              `src/utils.js`,
              `yarn.lock`
            ],
            D: [`src/alias.js`],
            A: [`src/utils.spec.js`, `wallaby.js`, `webpack.config.js`]
          },
          type: `commit`,
          analysis: {
            js: true,
            lint: false,
            tests: true,
            gitpartyrc: false,
            config: true,
            dependencies: true
          }
        },
        {
          status: [`M`, `M`, `M`, `M`, `M`, `M`, `M`],
          files: [
            `package.json`,
            `src/filters.js`,
            `src/gitparty.js`,
            `src/grouping.js`,
            `src/print.js`,
            `src/utils.js`,
            `yarn.lock`
          ],
          abbrevHash: `852f7ac`,
          subject: `add blob matching, start to clean up legend makery`,
          authorName: `brekk`,
          authorDate: `2018-05-01 07:48:20 -0700`,
          authorDateRel: `3 months ago`,
          ms: 1525186100000,
          date: `01-05-2018`,
          author: `brekk`,
          hash: `852f7ac`,
          changes: {
            M: [
              `package.json`,
              `src/filters.js`,
              `src/gitparty.js`,
              `src/grouping.js`,
              `src/print.js`,
              `src/utils.js`,
              `yarn.lock`
            ]
          },
          type: `commit`,
          analysis: {
            js: true,
            lint: false,
            tests: false,
            gitpartyrc: false,
            config: true,
            dependencies: true
          }
        },
        {
          status: [`M`, `M`, `M`],
          files: [`package.json`, `src/gitparty.js`, `yarn.lock`],
          abbrevHash: `322b8d0`,
          subject: `cleanups and more fp`,
          authorName: `brekk`,
          authorDate: `2018-05-01 07:05:16 -0700`,
          authorDateRel: `3 months ago`,
          ms: 1525183516000,
          date: `01-05-2018`,
          author: `brekk`,
          hash: `322b8d0`,
          changes: {
            M: [`package.json`, `src/gitparty.js`, `yarn.lock`]
          },
          type: `commit`,
          analysis: {
            js: true,
            lint: false,
            tests: false,
            gitpartyrc: false,
            config: true,
            dependencies: true
          }
        }
      ])
      t.end()
    })
})
