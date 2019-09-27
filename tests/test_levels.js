const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const LevelSpecTester = require('../tests-build/LevelSpecTester.js').default
const argv = require('minimist')(process.argv.slice(2), {
  boolean: ["fast"],
  string: ["speed-sample-size"],
  alias: {
    "fast": ["f"],
    "speed-sample-size": ["s"],
  }
})

let levelSpecs = glob.sync(path.resolve(__dirname, '../tests-build/') + '/level*.spec.js')
if (argv._.length > 0) {
  let regexps = argv._.map(str => new RegExp(str))
  levelSpecs = levelSpecs.filter(specFile => {
    let name = specFile.replace(/^.*\//, '').replace(/\.spec\.js$/, '')
    return regexps.some(regexp => regexp.test(name))
  })
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


let speedSampleSize = 2000

if (argv.fast) {
  speedSampleSize = 200
}

if (argv["speed-sample-size"]) {
  speedSampleSize = parseInt(argv["speed-sample-size"])
}

let globalReport = {
  fail: 0,
  pass: 0,
}

let startTime = Date.now()

for (let levelSpec of levelSpecs) {
  const spec = require(levelSpec).default
  spec.file = levelSpec.replace(/.*\//, '')

  const tester = new LevelSpecTester(spec, {
    stopOnFail: false,
    speedSampleSize: speedSampleSize,
    lengthSampleSize: 20,
    lossReasonSampleSize: 20,
    speedConfidence: 0.998,
    speedTestLostTolerance: 0.002,
    lengthTestLostTolerance: 0.002,
  })
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