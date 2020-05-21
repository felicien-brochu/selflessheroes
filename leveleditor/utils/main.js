const path = require('path')
const glob = require('glob')
const chalk = require('chalk')

const packLevel = require('./pack-level.js')
const testLevel = require('./test-level.js')
const checklist = require('./checklist.js')
const pushLevel = require('./push-level.js')
const register = require('./register.js')

if (process.argv.length < 3) {
  printUsage()
  process.exit(1)
}

let command = process.argv[2]
let commandArgv = process.argv.slice(3)

switch (command) {
  case 'pack-level':
    packLevel(commandArgv)
    break
  case 'test-level':
    testLevel(commandArgv)
    break
  case 'checklist':
    checklist(commandArgv)
    break
  case 'push-level':
    pushLevel(commandArgv)
    break
  case 'register':
    register(commandArgv)
    break
  default:
    printUnknownCommand(command)
    process.exit(1)
}

function printUsage() {
  console.log(
    `Usage: shutils command <level-directory> [--options]

available commands:
  pack-level          Creates a Selfless Heroes level (.shlv)
  test-level          Execute tests on the current level
  checklist           Check level files requirements
  push-level          Upload a level on Selfless Heroes API for review
	register            Create a user account on Selfless Heroes API

when no level-directory parameter, the working directory is used as level directory.`
  )
}

function printUnknownCommand(command) {
  console.log(`Unknown command "${command}"`)
  console.log()
  printUsage()
}