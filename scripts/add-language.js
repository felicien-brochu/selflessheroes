const fs = require('fs')
const glob = require('glob')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    "help",
  ],
  alias: {
    "help": ["h"],
  },
})

if (argv["help"]) {
  console.log(
    `
add-language adds a language to the project
Usage: node add-language.js <language>

  --help, -h                           Show this help message
`)
  process.exit(0)
}

const levelsPath = path.resolve(__dirname, '../src/levels/')
const language = argv._[0]


let levelMessagesEn = []
levelMessagesEn = glob.sync(levelsPath + '/level*/level*-messages-en.json')
console.log(levelMessagesEn)

levelMessagesEn.forEach(messagesEn => createLevelMessageFile(messagesEn, language))
let newMainMessagesFile = path.resolve(__dirname, `../src/locale/messages-${language}.json`)
fs.writeFile(newMainMessagesFile, '{}', err => {
  if (err) throw err;
  console.log(newMainMessagesFile, 'file created');
})

function createLevelMessageFile(messagesEn, language) {
  let newMessages = messagesEn.replace('-messages-en.json', `-messages-${language}.json`)
  fs.writeFile(newMessages, '{}', err => {
    if (err) throw err;
    console.log(newMessages, 'file created');
  })

  // console.log("createLevelMessageFile", newMessages, language)
}