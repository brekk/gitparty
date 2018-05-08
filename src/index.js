#!/usr/bin/env node
import path from 'path'
import read from 'read-data'
import parseArgs from 'minimist'
import { merge } from 'f-utility'
import { ARGV_CONFIG, DEFAULT_CONFIG } from './constants'
import { gitparty, remapConfigData } from './gitparty'

const argv = parseArgs(process.argv.slice(2), ARGV_CONFIG)

read.yaml(
  path.resolve(process.cwd(), argv.config || argv.c || `./.gitpartyrc`),
  (e, d) =>
    e ?
      console.warn(e) :
      gitparty(remapConfigData(d), merge(DEFAULT_CONFIG, argv))
)
