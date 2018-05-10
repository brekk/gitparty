#!/usr/bin/env node
import path from 'path'
import parseArgs from 'minimist'
import { ARGV_CONFIG } from './constants'
import { processAndPrintWithConfig } from './gitparty'

const config = parseArgs(process.argv.slice(2), ARGV_CONFIG)

const input = path.resolve(process.cwd(), config.c || `./.gitpartyrc`)

processAndPrintWithConfig(config, input)
