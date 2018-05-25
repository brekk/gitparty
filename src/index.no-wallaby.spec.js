import path from "path"
import execa from "execa"
import stripColor from "strip-color"
import test from "jest-t-assert"
import { split, pipe } from "f-utility"
// import { j2 } from './utils'

const cleanify = pipe(stripColor, (x) => split(`d985156`, x)[1], split(`\n`))

test.cb(`gitparty`, (t) => {
  t.plan(1)
  const CLI = path.resolve(__dirname, `../lib/index.js`)
  execa.shell(`node ${CLI} -l 7 --no-collapse`).then((x) => {
    /* eslint-disable max-len */
    t.deepEqual(cleanify(x.stdout), [
      ` - l                                                     $ brekk   | js`,
      `                  01-05-2018                                                                                            `,
      ` J     T           = 3deac85 - k                                                     $ brekk   | js`,
      ` J     T     C  D  = 90b8cc3 - j                                                     $ brekk   | js json lock`,
      ` J  L              = 3787b3e - i                                                     $ brekk   | eslintrc js`,
      ` J                 = 6665830 - h                                                     $ brekk   | js`,
      ` J                 = 3b2b915 - g                                                     $ brekk   | js`,
      ` J                 = 5986a42 - f                                                     $ brekk   | js`,
      ` J           C  D  = 758920e - e                                                     $ brekk   | js json lock`,
      ` J           C  D  = 8e52357 - d                                                     $ brekk   | js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J                 = 43b7fcb - c                                                     $ brekk   | js`,
      ` J           C  D  = 75e6d7e - b                                                     $ brekk   | js json lock`,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk   | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
  /* eslint-enable max-len */
})

test.cb(`gitparty --authorLength 15`, (t) => {
  t.plan(1)
  const CLI = path.resolve(__dirname, `../lib/index.js`)
  execa.shell(`node ${CLI} --authorLength 15`).then((x) => {
    /* eslint-disable max-len */
    t.deepEqual(cleanify(x.stdout), [
      ` - l                                                     $ brekk           | js`,
      `                  01-05-2018                                                                                            `,
      ` J     T           = 3deac85 - k                                                     $ brekk           | js`,
      ` J     T     C  D  = 90b8cc3 - j                                                     $ brekk           | js json lock`,
      ` J  L              = 3787b3e - i                                                     $ brekk           | eslintrc js`,
      ` J                 = 6665830 - h                                                     $ brekk           | js`,
      ` J                 = 3b2b915 - g                                                     $ brekk           | js`,
      ` J                 = 5986a42 - f                                                     $ brekk           | js`,
      ` J           C  D  = 758920e - e                                                     $ brekk           | js json lock`,
      ` J           C  D  = 8e52357 - d                                                     $ brekk           | js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J                 = 43b7fcb - c                                                     $ brekk           | js`,
      ` J           C  D  = 75e6d7e - b                                                     $ brekk           | js json lock`,
      ` J  L        C  D  = 1c5ffd2 - initial commit                                        $ brekk           | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
  /* eslint-enable max-len */
})

test.cb(`gitparty --collapse`, (t) => {
  t.plan(1)
  const CLI = path.resolve(__dirname, `../lib/index.js`)
  execa.shell(`node ${CLI} -a`).then((x) => {
    /* eslint-disable max-len */
    t.deepEqual(cleanify(x.stdout), [
      ` - o + n + m + l                                         $ brekk   | js json`,
      `                  01-05-2018                                                                                            `,
      ` J  L  T     C  D  = 8e52357 - k + j + i + h + g + f + e + d                         $ brekk   | eslintrc js json lock`,
      `                  30-04-2018                                                                                            `,
      ` J  L        C  D  = 1c5ffd2 - c + b + initial commit                                $ brekk   | babelrc eslintrc gitignore js json lock madgerc npmignore yml`
    ])
    t.end()
  })
  /* eslint-enable max-len */
})

test.cb(`gitparty -f hash:1c5ffd2 -j`, (t) => {
  t.plan(1)
  const CLI = path.resolve(__dirname, `../lib/index.js`)
  execa.shell(`node ${CLI} -f hash:1c5ffd2 -j`).then((x) => {
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
