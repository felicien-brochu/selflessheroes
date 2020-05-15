const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const minimist = require('minimist')
const parseLevel = require('./parse-level.js')
const packLevel = require('./pack-level.js')
const testLevel = require('./test-level.js')

module.exports = function checklist(argv) {
  argv = minimist(argv, {
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
 checklist runs a series of tests on a Selfless Heroes level (.shlv)

 Usage: shutils checklist <level-directory> [--options]

  --help, -h              Show this help message
	`)
    return
  }

  let levelDir = '.'
  if (argv._.length > 0) {
    levelDir = argv._[0]
  }
  levelDir = path.resolve(levelDir)

  packLevel([levelDir])

  let errors = 0
  errors = checkMandatoryFilesExist(levelDir)
  if (errors > 0) {
    return
  }

  errors += checkMetadata(levelDir)
  errors += checkLevelAndTests(levelDir)

  console.log()

  errors += testLevel([levelDir, "-S"])
  console.log()

  let errorsStr = errors > 0 ? chalk.redBright.bold(errors) : chalk.greenBright.bold(errors)
  console.log(chalk.gray.bgBlack(` Errors: ${errorsStr} `))

  return errors
}

function checkMandatoryFilesExist(levelDir) {
  console.log(chalk.gray.bgBlack(" Check file tree "))
  const mandatoryFiles = ["map.json", "level.js", "metadata.json", "tests.json", "level.shlv"]
  let errors = 0

  for (let file of mandatoryFiles) {
    let filePath = path.resolve(levelDir, file)
    if (!fs.existsSync(filePath)) {
      console.log(`${chalk.red.bold(logSymbols.error)} ${file} ${chalk.red.bold('[missing]')}`)
      errors++
    } else {
      console.log(`${chalk.greenBright.bold(logSymbols.success)} ${file} ${chalk.greenBright.bold('[exists]')}`)
    }
  }
  console.log()

  return errors
}

function checkMetadata(levelDir) {
  const metadataFile = path.resolve(levelDir, "metadata.json")
  let metadata
  try {
    metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'))
  } catch (e) {
    console.log(`${chalk.red.bold(logSymbols.error)} metadata.json is not a valid JSON file ${chalk.red.bold('[invalid]')}`)
    console.log(e)
    return 1
  }

  let errors = 0

  console.log(chalk.gray.bgBlack(" Check metadata.json "))
  if (typeof metadata.id === 'string' && /^[a-z]{2,4}\.[a-z0-9-_]+\.[a-z0-9-_]+$/.test(metadata.id)) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} id: "${metadata.id}" ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} id: "${metadata.id}" ${chalk.red.bold('[invalid]')}`)
    console.log("level id must be of the form 'com.author.levelname'")
    errors++
  }

  let authorRegExp = /[^\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s-]/
  if (typeof metadata.author === 'string' && !authorRegExp.test(metadata.author)) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} author: "${metadata.author}" ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} author: "${metadata.author}" ${chalk.red.bold('[invalid]')}`)
    if (!metadata.author) {
      console.log("author field is mandatory")
    } else {
      console.log("invalid character in author field", authorRegExp.exec(metadata.author))
    }
    errors++
  }

  if (typeof metadata.difficulty === 'number' && metadata.difficulty >= 0 && metadata.difficulty <= 4) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} difficulty: ${metadata.difficulty} ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} difficulty: ${metadata.difficulty} ${chalk.red.bold('[invalid]')}`)
    if (metadata.difficulty === undefined) {
      console.log("difficulty field is mandatory")
    } else {
      console.log("difficulty must be in range [0,4]")
    }
    errors++
  }


  console.log()

  return errors
}

function checkLevelAndTests(levelDir) {
  const level = parseLevel(levelDir)

  let errors = 0

  console.log(chalk.gray.bgBlack(" Check level.js "))

  let customLossReasons = []

  if (!level.ruleset || !level.ruleset.win || !level.ruleset.lose) {
    console.log(`${chalk.red.bold(logSymbols.error)} ruleset ${chalk.red.bold('[invalid]')}`)
    console.log("ruleset must be an Object of the form {win: <winCondition>, lose: <loseCondition>}")
    errors++
  } else {
    if (Array.isArray(level.ruleset.lose)) {
      for (let condition of level.ruleset.lose) {
        if (typeof condition === 'object') {
          customLossReasons.push(condition.getReason())
        }
      }
    }
  }

  if (level.messages && level.messages.en && level.messages.en.name && typeof level.messages.en.name === 'string' && level.messages.en.name.length > 0) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} messages.en.name ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} messages.en.name ${chalk.red.bold('[invalid]')}`)
    console.log("messages.en.name is required and must be a non-empty string")
    errors++
  }

  if (level.messages && level.messages.en && level.messages.en.objective && typeof level.messages.en.objective === 'string' && level.messages.en.objective.length > 0) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} messages.en.objective ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} messages.en.objective ${chalk.red.bold('[invalid]')}`)
    console.log("messages.en.objective is required and must be a non-empty string")
    errors++
  }

  for (let customLossReason of customLossReasons) {
    if (level.messages && level.messages.en && level.messages.en[customLossReason] && typeof level.messages.en[customLossReason] === 'string' && level.messages.en[customLossReason].length > 0) {
      console.log(`${chalk.greenBright.bold(logSymbols.success)} messages.en.${customLossReason} ${chalk.greenBright.bold('[valid]')}`)
    } else {
      console.log(`${chalk.red.bold(logSymbols.error)} messages.en.${customLossReason} ${chalk.red.bold('[invalid]')}`)
      console.log("when you create a custom loss reason, a corresponding message is required and must be a non-empty string")
      errors++
    }
  }

  if (typeof level.maxStep === 'number' && level.maxStep >= 1 && level.maxStep <= 20000) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} maxStep ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} maxStep ${chalk.red.bold('[invalid]')}`)
    console.log("maxStep is required and must be in range [1,20000]")
    errors++
  }

  if (typeof level.speedTarget === 'number' && level.speedTarget >= 1 && level.speedTarget <= level.maxStep) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} speedTarget ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} speedTarget ${chalk.red.bold('[invalid]')}`)
    console.log("speedTarget is required and must be in range [1,maxStep]")
    errors++
  }

  if (typeof level.lengthTarget === 'number' && level.lengthTarget >= 1) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} lengthTarget ${chalk.greenBright.bold('[valid]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} lengthTarget ${chalk.red.bold('[invalid]')}`)
    console.log("lengthTarget is required and must be greater or equal to 1")
    errors++
  }

  console.log()

  console.log(chalk.gray.bgBlack(" Check tests.json "))
  let testsSpecs = readTestsSpecs(levelDir)

  if (testsSpecs.some(spec => spec.type.some(type => type === 'length'))) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} length test ${chalk.greenBright.bold('[exists]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} length test ${chalk.red.bold('[missing]')}`)
    console.log("at least 1 length test is required")
    errors++
  }

  if (testsSpecs.some(spec => spec.type.some(type => type === 'speed'))) {
    console.log(`${chalk.greenBright.bold(logSymbols.success)} speed test ${chalk.greenBright.bold('[exists]')}`)
  } else {
    console.log(`${chalk.red.bold(logSymbols.error)} speed test ${chalk.red.bold('[missing]')}`)
    console.log("at least 1 speed test is required")
    errors++
  }

  for (let customLossReason of customLossReasons) {
    if (testsSpecs.some(spec => spec.type[0] === 'lossReason' && spec.lossReason === customLossReason)) {
      console.log(`${chalk.greenBright.bold(logSymbols.success)} custom loss reason test (${customLossReason}) ${chalk.greenBright.bold('[exists]')}`)
    } else {
      console.log(`${chalk.red.bold(logSymbols.error)} custom loss reason test (${customLossReason}) ${chalk.red.bold('[missing]')}`)
      console.log("at least 1 test is required by custom loss reason")
      errors++
    }
  }

  return errors
}

function readTestsSpecs(levelDir) {
  const testsSpecsPath = path.resolve(levelDir, "tests.json")
  let testsSpecs = JSON.parse(fs.readFileSync(testsSpecsPath, 'utf8'))

  return testsSpecs
}