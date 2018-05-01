const pkg = require(`../package.json`)
const shared = require(`./config.shared`)

const output = {
  name: `hugs`,
  file: `./${pkg.name}.js`,
  format: `cjs`,
  banner: `#!/usr/bin/env node`
}

module.exports = shared(output)
