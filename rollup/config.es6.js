const pkg = require(`../package.json`)
const shared = require(`./config.shared`)

const output = {
  file: `./${pkg.name}.mjs`,
  format: `es`,
  banner: `#!/usr/bin/env node`
}

module.exports = shared(output)
