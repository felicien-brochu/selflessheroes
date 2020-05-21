const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const minimist = require('minimist')
const prompts = require('prompts')
const checklist = require('./checklist.js')
const zipper = require('./zipper.js')
const api = require('./api')

module.exports = async function pushLevel(argv) {
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
 push-level uploads a level on Selfless Heroes API for review

 Usage: shutils push-level <level-directory> [--options]

  --help, -h              Show this help message
	`)
    return
  }

  let loginResult = await login()
  console.log()
  if (!loginResult) {
    return
  }

  let levelDir = '.'
  if (argv._.length > 0) {
    levelDir = argv._[0]
  }
  levelDir = path.resolve(levelDir)

  console.log()
  console.log(chalk.bgBlack(' Checklist '))
  console.log()

  let errors = checklist([levelDir])
  if (errors > 0) {
    console.log(chalk.gray.bgBlack(` Errors: ${chalk.redBright.bold(errors)} => ${chalk.redBright.bold('resolve these errors before pushing this level to the API for review')}`))
    return errors
  }

  const levelPath = path.resolve(levelDir, "level.shlv")
  let levelJson = JSON.parse(fs.readFileSync(levelPath, 'utf8'))
  let levelId = levelJson.metadata.id

  let zipFile = zipper(levelDir)

  let req = await api.uploadLevel(levelId, zipFile)

  if (req.isAxiosError) {
    console.log(chalk.redBright.bold(`Error during level upload (${req.response.status} ${req.response.statusText})`))
    console.log(req.response.data.message)
    return
  }

  console.log(chalk.greenBright.bold(`Level uploaded successfully.\n`))
  console.log(chalk.bgBlack(` It will be reviewed as soon as possible.\n Thank you for your contribution! :)`))
  console.log()
}

async function login() {
  const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  const questions = [{
      type: 'text',
      name: 'email',
      message: 'email',
      validate: email => {
        return !email.match(emailRegExp) ?
          'Invalid email address.' : true
      }
    },
    {
      type: 'password',
      name: 'password',
      message: 'password',
      validate: password => {
        return password.length < 8 ?
          'Invalid password. Must be at least 8 characters long.' : true
      }
    }
  ]

  let loginInfo = await prompts(questions)

  let req = await api.login(loginInfo)
  if (req.isAxiosError) {
    console.log(chalk.redBright.bold(`Login error\n${req.response.data.message}`))
    return false
  }
  console.log(chalk.greenBright.bold(`Login successful`))
  return true
}