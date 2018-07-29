#!/usr/bin/env node
import path from "path"
import chalk from "chalk"
import parseArgs from "yargs-parser"
import { ARGV_CONFIG } from "./constants"
import { processAndPrintWithConfig } from "./gitparty"

const config = parseArgs(process.argv.slice(2), ARGV_CONFIG)
const { yellow: y } = chalk
/* eslint-disable no-console */
if (config.h) {
  console.log(`
# gitparty! it's a party for your git log

--${y(`help`)} / -${y(`h`)}
  it's this thing you're reading now!

## configuration

--${y(`output`)} / -${y(`o`)}
  write the results to a file. usually useful in concert with the --json flag
--${y(`json`)} / -${y(`j`)}
  return JSON output instead of converting to colorized strings
--${y(`repo`)} / -${y(`r`)}
  choose a different git repository
--${y(`number`)} / -${y(`n`)}
  choose a number of total commits (default: 100)

## filtering

--${y(`collapse`)} / --${y(`collapseAuthors`)} / -${y(`a`)}
  merge commits if the authors are the same and the commit dates are the same
--${y(`filterMergeCommits`)} / -${y(`m`)}
  merge commits beginning with the string 'Merge '
--${y(`filter`)} / -${y(`f`)}
  filter commits based on a simple syntax
    * -f "hash:80ca7f7" / -f "date:20-05-2018"
      lookup by exact string matching (default)
    * -f "subject:fix~"
      lookup by looser indexOf matching
    * -f "subject:fix~#date:20-05-2018"
      lookup with multiple facets
    * -f "author:brekk"
      when filtering by author, aliases are used
    * -f "files:**/src/*.spec.js"
      when there are asterisks present in the value side (after the ":")
      and the key is an array, glob-style matching is performed

## formatting

--${y(`authorLength`)} / -${y(`l`)}
  set a max width for author length (default: 7)
--${y(`subjectLength`)} / -${y(`s`)}
  set a max width for subject length (default: 50)
--${y(`bannerLength`)} / -${y(`b`)}
  set a max width for banner length (default: 120)
--${y(`bannerIndent`)} / -${y(`i`)}
  set a max width for banner indent (default: 28)


`)
} else {
  const input = path.resolve(process.cwd(), config.config || `./.gitpartyrc`)
  processAndPrintWithConfig(config, input)
}
/* eslint-enable no-console */
