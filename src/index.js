#!/usr/bin/env node
import path from 'path'
import parseArgs from 'minimist'
import { ARGV_CONFIG } from './constants'
import { gitparty } from './gitparty'

const argv = parseArgs(process.argv.slice(2), ARGV_CONFIG)

const input = path.resolve(process.cwd(), argv.c || `./.gitpartyrc`)

gitparty(argv, input)
