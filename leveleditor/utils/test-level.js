const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const minimist = require('minimist')
const LevelSpecTester = require('../../tests-build/LevelSpecTester.js').default
const parseLevel = require('./parse-level.js')
const packLevel = require('./pack-level.js')

module.exports = function testLevel(argv) {
  argv = minimist(argv, {
    boolean: [
      "help",
      "fast",
      "slow",
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
 test-level tests Selfless Heroes level solutions
 Usage: shutils test-level <level-directory> [--options]

  --help, -h                           Show this help message

  --fast, -F                           Execute fast tests (-s ${fastPreset.speedSampleSize} -c ${fastPreset.lengthSampleSize} -l ${fastPreset.lossReasonSampleSize})

  --slow, -S                           Execute slow tests (-s ${slowPreset.speedSampleSize} -c ${slowPreset.lengthSampleSize} -l ${slowPreset.lossReasonSampleSize})

  --speed-sample-size, -s              Sample size for speed tests (default: ${speedSampleSize})

  --length-sample-size, -c             Sample size for code length tests (default: ${lengthSampleSize})

  --loss-sample-size, -l               Sample size for loss reason tests (default: ${lossReasonSampleSize})

  --speed-confidence                   Speed tests minimum confidence in speed (default: ${speedConfidence})

  --speed-lost-tolerance               Speed tests losses tolerance ratio (default: ${speedTestLostTolerance})

  --length-lost-tolerance              Length tests losses tolerance ratio (default: ${lengthTestLostTolerance})
`)
    return
  }

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

  let levelDir = '.'
  if (argv._.length > 0) {
    levelDir = argv._[0]
  }
  levelDir = path.resolve(levelDir)

  let levelPath = path.resolve(levelDir, "level.shlv")
  if (!fs.existsSync(levelPath)) {
    console.log(`Cannot find file "${levelPath}"`)
    process.exit(1)
  }

  let testsConfigPath = path.resolve(levelDir, "tests.json")
  if (!fs.existsSync(testsConfigPath)) {
    console.log(`Cannot find file "${testsConfigPath}"`)
    process.exit(1)
  }

  packLevel([levelDir])
  const testsSpecs = readTestsSpecs(levelDir)
  const level = parseLevel(levelDir)

  const testsConfig = {
    level: level,
    specs: testsSpecs,
    file: "level.shlv"
  }

  let globalReport = {
    fail: 0,
    pass: 0,
  }
  let startTime = Date.now()

  const tester = new LevelSpecTester(testsConfig, testerConf, 'local')
  let report = tester.test()

  globalReport.fail += report.fail
  globalReport.pass += report.pass

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

  return globalReport.fail
}

function readTestsSpecs(levelDir) {
  const testsSpecsPath = path.resolve(levelDir, "tests.json")
  let testsSpecs = JSON.parse(fs.readFileSync(testsSpecsPath, 'utf8'))

  for (let testSpec of testsSpecs) {
    let codeFile = path.resolve(levelDir, testSpec.code)
    let code = fs.readFileSync(codeFile, 'utf8')
    testSpec.code = code
  }

  return testsSpecs
}