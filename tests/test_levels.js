const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const LevelSpecTester = require('../tests-build/LevelSpecTester.js').default
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    "help",
    "fast",
    "slow",
    "stop-on-fail",
  ],
  string: [
    "speed-sample-size",
    "length-sample-size",
    "loss-sample-size",
    "speed-confidence",
    "speed-lost-tolerance",
    "length-lost-tolerance",
  ],
  alias: {
    "help": ["h"],
    "fast": ["F"],
    "slow": ["S"],
    "speed-sample-size": ["s"],
    "length-sample-size": ["c"],
    "loss-sample-size": ["l"],
  }
})

let stopOnFail = false
let speedSampleSize = 2000
let lengthSampleSize = 500
let lossReasonSampleSize = 20
let speedConfidence = 0.999
let speedTestLostTolerance = 0.002
let lengthTestLostTolerance = 0.002

const fastPreset = {
  speedSampleSize: 100,
  lengthSampleSize: 20,
  lossReasonSampleSize: 20,
}

const slowPreset = {
  speedSampleSize: 20000,
  lengthSampleSize: 5000,
  lossReasonSampleSize: 1000,
}

if (argv["help"]) {
  console.log(
    `
tests_levels tests Selfless Heroes levels *.spec.js files

Usage: node test_levels.js [--options] [-- regexpFilters] [!]


  --help, -h                           Show this help message

  regexpFilters                        List of regexps to filter .spec.js files to test

  --stop-on-fail, !                    Stops the tests as soon as one fails

  --fast, -F                           Execute fast tests (-s ${fastPreset.speedSampleSize} -c ${fastPreset.lengthSampleSize} -l ${fastPreset.lossReasonSampleSize})

  --slow, -S                           Execute slow tests (-s ${slowPreset.speedSampleSize} -c ${slowPreset.lengthSampleSize} -l ${slowPreset.lossReasonSampleSize})

  --speed-sample-size, -s              Sample size for speed tests (default: ${speedSampleSize})

  --length-sample-size, -c             Sample size for code length tests (default: ${lengthSampleSize})

  --loss-sample-size, -l               Sample size for loss reason tests (default: ${lossReasonSampleSize})

  --speed-confidence                   Speed tests minimum confidence in speed (default: ${speedConfidence})

  --speed-lost-tolerance               Speed tests losses tolerance ratio (default: ${speedTestLostTolerance})

  --length-lost-tolerance              Length tests losses tolerance ratio (default: ${lengthTestLostTolerance})
`)
  process.exit(0)
}



let levelSpecs = glob.sync(path.resolve(__dirname, '../tests-build/') + '/level*.spec.js')
if (argv._.length > 0) {
  let specFilters = argv._.slice()

  let exclamationPointIndex = argv._.indexOf("!")
  if (exclamationPointIndex >= 0) {
    stopOnFail = true
    specFilters.splice(exclamationPointIndex, 1)
  }

  if (specFilters.length > 0) {
    let regexps = specFilters.map(str => new RegExp(str))
    levelSpecs = levelSpecs.filter(specFile => {
      let name = specFile.replace(/^.*\//, '').replace(/\.spec\.js$/, '')
      return regexps.some(regexp => regexp.test(name))
    })
  }
}


// sort specs
const specNumber = spec => parseInt(spec.replace(/^.*\/level/, '').replace(/\.spec\.js$/, ''))
levelSpecs.sort((a, b) => specNumber(a) - specNumber(b))

console.log()
console.log("Selected spec files:")
levelSpecs.map(specFile => specFile.replace(/^.*\//, '')).forEach(name => {
  console.log(`- ${chalk.yellowBright(name)}`)
})
console.log()




if (argv.slow) {
  speedSampleSize = slowPreset.speedSampleSize
  lengthSampleSize = slowPreset.lengthSampleSize
  lossReasonSampleSize = slowPreset.lossReasonSampleSize
}

if (argv.fast) {
  speedSampleSize = fastPreset.speedSampleSize
  lengthSampleSize = fastPreset.lengthSampleSize
  lossReasonSampleSize = fastPreset.lossReasonSampleSize
}

if (argv["stop-on-fail"]) {
  stopOnFail = argv["stop-on-fail"]
}
if (argv["speed-sample-size"]) {
  speedSampleSize = parseInt(argv["speed-sample-size"])
}
if (argv["length-sample-size"]) {
  lengthSampleSize = parseInt(argv["length-sample-size"])
}
if (argv["loss-sample-size"]) {
  lossReasonSampleSize = parseInt(argv["loss-sample-size"])
}
if (argv["speed-confidence"]) {
  speedConfidence = parseFloat(argv["speed-confidence"])
}
if (argv["speed-lost-tolerance"]) {
  speedTestLostTolerance = parseFloat(argv["speed-lost-tolerance"])
}
if (argv["length-lost-tolerance"]) {
  lengthTestLostTolerance = parseFloat(argv["length-lost-tolerance"])
}

const testerConf = {
  stopOnFail: stopOnFail,
  speedSampleSize: speedSampleSize,
  lengthSampleSize: lengthSampleSize,
  lossReasonSampleSize: lossReasonSampleSize,
  speedConfidence: speedConfidence,
  speedTestLostTolerance: speedTestLostTolerance,
  lengthTestLostTolerance: lengthTestLostTolerance,
}
console.log("Tester config:")
console.log(chalk.gray("stopOnFail:              ") + testerConf.stopOnFail)
console.log(chalk.gray("speedSampleSize:         ") + testerConf.speedSampleSize)
console.log(chalk.gray("lengthSampleSize:        ") + testerConf.lengthSampleSize)
console.log(chalk.gray("lossReasonSampleSize:    ") + testerConf.lossReasonSampleSize)
console.log(chalk.gray("speedConfidence:         ") + testerConf.speedConfidence)
console.log(chalk.gray("speedTestLostTolerance:  ") + testerConf.speedTestLostTolerance)
console.log(chalk.gray("lengthTestLostTolerance: ") + testerConf.lengthTestLostTolerance)
console.log()

let globalReport = {
  fail: 0,
  pass: 0,
}
let startTime = Date.now()

for (let levelSpec of levelSpecs) {
  const spec = require(levelSpec).default
  spec.file = levelSpec.replace(/.*\//, '')

  const tester = new LevelSpecTester(spec, testerConf)
  let report = tester.test()

  globalReport.fail += report.fail
  globalReport.pass += report.pass
}

let testDuration = (Date.now() - startTime) / 1000
const durationToString = d => {
  let s = ''
  if (d > 3600 * 24) {
    let days = Math.floor(d / (3600 * 24))
    s += `${days}d`
    d -= days * (3600 * 24)
  }

  if (d > 3600 || s !== '') {
    let hours = Math.floor(d / 3600)
    if (s !== '') {
      s += ' '
    }
    s += `${hours}h`
    d -= hours * 3600
  }

  if (d > 60 || s !== '') {
    let min = Math.floor(d / 60)
    if (s !== '') {
      s += ' '
    }
    s += `${min}m`
    d -= min * 60
  }

  if (s !== '') {
    s += ' '
  }
  s += `${Math.round(d * 100) / 100}s`

  return s
}
console.log()
console.log()
console.log(chalk.gray.bgBlack(` Tests executed ${chalk.white.bold(globalReport.fail + globalReport.pass)} in ${chalk.white.bold(durationToString(testDuration))}: pass: ${chalk.greenBright.bold(globalReport.pass)}, fail: ${chalk.redBright.bold(globalReport.fail)} `))
console.log()