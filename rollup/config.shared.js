const pkg = require(`../package.json`)
const { bundle } = require(`germs`)
const { default: shebang } = require(`rollup-plugin-preserve-shebang`)
const builtins = require(`rollup-plugin-node-builtins`)

const external = pkg && pkg.dependencies ? Object.keys(pkg.dependencies) : []

const concat = (x) => (y) => y.concat(x)

module.exports = (output) =>
  bundle({
    name: pkg.name,
    alterPlugins: concat([
      builtins(),
      shebang({
        shebang: `#!/usr/bin/env node`
      })
    ]),
    external,
    input: `src/gitparty.js`,
    output
  })
