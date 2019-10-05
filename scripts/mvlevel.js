const fs = require('fs')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    "help",
    "same-id",
  ],
  string: [],
  alias: {
    "help": ["h"],
    "same-id": ["s"],
  },
})

if (argv["help"]) {
  console.log(
    `
mvlevel rename a level
Usage: node mvlevel.js [--options] <levelID> <targetID>

  --help, -h                           Show this help message
  --same-id, -s                        Don't change the id of the level in levelManager
`)
  process.exit(0)
}

const srcPath = path.resolve(__dirname, '../src/')
const levelID = argv._[0]
const targetID = argv._[1]

if (!levelID || !targetID) {
  console.error("levelID or targetID missing.")
  process.exit(1)
}


console.log(`Try to rename level${levelID} to level${targetID} ...`)

const mapPath = path.resolve(srcPath, "levels/maps")
const levelFolder = path.resolve(srcPath, "levels/level" + levelID)
const targetFolder = path.resolve(srcPath, "levels/level" + targetID)

let files = {
  dir: {
    src: levelFolder,
    target: targetFolder,
  },
  level: {
    src: path.resolve(levelFolder, `level${levelID}.js`),
    target: path.resolve(targetFolder, `level${targetID}.js`),
  },
  spec: {
    src: path.resolve(levelFolder, `level${levelID}.spec.js`),
    target: path.resolve(targetFolder, `level${targetID}.spec.js`),
  },
  jsonMap: {
    src: path.resolve(levelFolder, `map${levelID}.json`),
    target: path.resolve(targetFolder, `map${targetID}.json`),
  },
  map: {
    src: path.resolve(mapPath, `map${levelID}.tmx`),
    target: path.resolve(mapPath, `map${targetID}.tmx`),
  },
}
// console.log("FILES:", files)

try {
  fs.mkdirSync(files.dir.target)
} catch (e) {}
console.log("--> RENAME ", files.level)
fs.renameSync(files.level.src, files.level.target)

console.log("--> RENAME ", files.spec)
fs.renameSync(files.spec.src, files.spec.target)

console.log("--> RENAME ", files.jsonMap)
fs.renameSync(files.jsonMap.src, files.jsonMap.target)

console.log("--> RENAME ", files.map)
fs.renameSync(files.map.src, files.map.target)


try {
  fs.rmdirSync(files.dir.src)
} catch (e) {
  console.error(e)
}

function replaceInFile(file, regexp, replacement) {
  let data = fs.readFileSync(file, 'utf8')
  let regex = new RegExp(regexp, 'g')
  var result = data.replace(regex, replacement)

  fs.writeFileSync(file, result, 'utf8')
}

function findInFile(file, regexp) {
  let data = fs.readFileSync(file, 'utf8')
  let regex = new RegExp(regexp, 'g')
  return regex.exec(data)
}

replaceInFile(files.level.target, `import map from '\\./map${levelID}\\.json'`, `import map from './map${targetID}.json'`)

replaceInFile(files.spec.target, `import level from '\\./level${levelID}'`, `import level from './level${targetID}'`)

const levelManager = path.resolve(srcPath, "levels/levelManager.js")
let oldID = parseInt(findInFile(levelManager, `new Level\\(([0-9]+), level${levelID}\\),`)[1])
let newID = argv["same-id"] ? oldID : parseInt(targetID)
console.log("==> Change id ", oldID)
console.log("==> BY ", newID)
replaceInFile(levelManager, `import level${levelID} from '\\./level${levelID}/level${levelID}'`, `import level${targetID} from './level${targetID}/level${targetID}'`)

replaceInFile(levelManager, `new Level\\(${oldID}, level${levelID}\\),`, `new Level(${newID}, level${targetID}),`)

if (!argv["same-id"]) {
  replaceInFile(levelManager, ` ${oldID}`, ` ${newID}`)
  replaceInFile(levelManager, `\\[${oldID}`, `[${newID}`)
}