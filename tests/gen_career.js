const path = require('path')
const glob = require('glob')
const generateCareer = require('../tests-build/CareerGenerator.js').default
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    "help",
  ],
  alias: {
    "help": ["h"],
  }
})

if (argv["help"]) {
  console.log(
    `
Creates a complete career from specs.

Usage: node gen-complete-career.js

  --help, -h          Show this help message
`)
  process.exit(0)
}

let destinationFile = argv._[0]
let levelSpecs = glob.sync(path.resolve(__dirname, '../tests-build/') + '/level*.spec.js')
let specs = levelSpecs.map(levelSpec => require(levelSpec).default)

let careerSave = generateCareer(specs, require("../package.json").version)
console.log(JSON.stringify(careerSave))