const path = require('path')
const fs = require('fs')
const {
  NodeVM
} = require('../../src/libs/vm2/main.js')

module.exports = function parseLevel(levelDir) {
  const levelWrapper = readLevelFile(levelDir)
  const vm = new NodeVM({
    console: 'inherit',
    sandbox: {}
  })
  return vm.run(levelWrapper.level)
}

function readLevelFile(levelDir) {
  const levelPath = path.resolve(levelDir, "level.shlv")
  return JSON.parse(fs.readFileSync(levelPath, 'utf8'))
}