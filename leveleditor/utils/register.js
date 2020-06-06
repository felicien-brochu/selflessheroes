const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const minimist = require('minimist')
const prompts = require('prompts')
const api = require('./api')

module.exports = function registerCommand(argv) {
  argv = minimist(argv, {
    boolean: [
      "help",
      "activate",
      "send-email",
    ],
    alias: {
      "help": ["h"]
    }
  })

  if (argv["help"]) {
    console.log(
      `
 register creates a user account on Selfless Heroes API

 Usage: shutils register [--options]

  --help, -h              Show this help message

	--send-email            Send an activation code at your email address

	--activate              Activate an account with an activation code
	`)
    return
  }

  if (argv["activate"]) {
    activateAccount()
  } else if (argv["send-email"]) {
    sendActivationCodeEmail()
  } else {
    registrationProcess()
  }
}

const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const notUsernameRegExp = /[^\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff -]/


async function registrationProcess() {

  const questions = [{
      type: 'text',
      name: 'username',
      message: 'username',
      validate: username => {
        return username.match(notUsernameRegExp) ||
          username.trim().length < 2 ||
          username.trim().length > 16 ?
          'User name must be 2 to 16 characters long. Only letters, digits, dash, underscore or space.' : true
      },
      format: username => username.trim()
    },
    {
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

  let userInfo = await prompts(questions)

  let req = await api.registerUser(userInfo)

  if (req.isAxiosError) {
    console.log(chalk.redBright.bold(`Error during user registration (${req.response.status} ${req.response.statusText})`))

    if (req.response.status === 409) {
      console.log(`username unavailable or account for email ${userInfo.email} already exists.`)
    }
    return
  }

  console.log(chalk.greenBright.bold(`User registration success`))
  console.log()

  activateAccount(userInfo.email)
}

async function activateAccount(email) {
  const questions = []
  let code = null

  if (!email) {
    questions.push({
      type: 'text',
      name: 'email',
      message: 'email',
      validate: email => {
        return !email.match(emailRegExp) ?
          'Invalid email address.' : true
      }
    })
  }
  questions.push({
    type: 'text',
    name: 'code',
    message: 'activation code received by email',
    validate: code => code.trim().length !== 6 ? 'Invalid activation code.' : true,
    format: code => code.trim()
  })

  let res = await prompts(questions)
  if (!email) {
    email = res.email
  }
  code = res.code

  let req = await api.activateUserAccount({
    email,
    code
  })

  if (req.isAxiosError) {
    console.log(chalk.redBright.bold(`Error during user account activation (${req.response.status} ${req.response.statusText})`))
    console.log(req.response.data)
    return
  }

  console.log(chalk.greenBright.bold(`User account activated successfully`))
  console.log()
}

async function sendActivationCodeEmail(email) {
  if (!email) {
    let res = await prompts([{
      type: 'text',
      name: 'email',
      message: 'email',
      validate: email => {
        return !email.match(emailRegExp) ?
          'Invalid email address.' : true
      }
    }])

    email = res.email
  }

  let req = await api.sendActivationCodeEmail({
    email,
  })

  if (req.isAxiosError) {
    console.log(chalk.redBright.bold(`Error sending account activation code email (${req.response.status} ${req.response.statusText})`))
    console.log(req.response.data)
    return
  }

  console.log(chalk.greenBright.bold(`Activation code email sent successfully`))
}