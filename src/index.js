#!/usr/bin/env node
import path from 'path'
import read from 'read-data'
import { encase } from 'fluture'
import parseArgs from 'minimist'
import { fork, merge, pipe } from 'f-utility'
import { ARGV_CONFIG, DEFAULT_CONFIG } from './constants'
import { gitparty, remapConfigData, write } from './gitparty'

const argv = parseArgs(process.argv.slice(2), ARGV_CONFIG)

read.yaml(
  path.resolve(process.cwd(), argv.config || argv.c || `./.gitpartyrc`),
  (e, d) => {
    if (e) return console.warn(e)
    pipe(
      remapConfigData,
      gitparty(merge(DEFAULT_CONFIG, argv)),
      fork(console.warn, argv.o ? write(argv.o) : console.log)
    )(d)
  }
)
