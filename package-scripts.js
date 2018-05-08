const germs = require(`germs`)
const pkg = require(`./package.json`)
const utils = require(`nps-utils`)
const { merge } = require(`f-utility`)
const allNPS = utils.concurrent.nps
//
const built = [`del coverage`, `del lib`, `del docs`]

const GERMS = germs.build(pkg.name, {
  readme: `echo "documentation readme -s API src/*.js"`,
  prepublishOnly: `nps care`,
  clean: utils.concurrent(built),
  scrub: utils.concurrent(
    built.concat([`del dependenc*`, `del yarn.lock`, `del node_modules`])
  )
})
/* eslint-disable fp/no-mutation */
GERMS.scripts.build = `babel src -d lib --ignore *.spec.js && chmod 755 lib/index.js`
GERMS.scripts.docs = {
  script: `documentation build -c documentation.yml src/index.js -f md -o docs/API.md -a public`,
  description: `build docs`
}
GERMS.scripts.bundle = merge(GERMS.scripts.bundle, {
  debug: {
    script: `rollup -c rollup/debug.commonjs.js`,
    description: `generate debug version`
  }
})
GERMS.scripts.bundle.script = allNPS(
  `bundle.commonjs`,
  `bundle.es6`,
  `bundle.debug`
)
GERMS.scripts.lint.project = `clinton`
GERMS.scripts.lint.jsdoc = `echo "documentation lint"`
GERMS.scripts.lint = merge(GERMS.scripts.lint, {
  script: allNPS(`lint.src`, `lint.jsdoc`)
})
/* eslint-enable fp/no-mutation */

module.exports = GERMS
