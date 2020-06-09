const fs = require('fs')
const path = require('path')
const JSZip = require('jszip-sync')
const slash = require('slash')

function getZippedFolderSync(dir) {
  let allPaths = getFilePathsRecursiveSync(dir)

  let zip = new JSZip()
  let zipped = zip.sync(() => {
    for (let filePath of allPaths) {
      let addPath = path.relative(dir, filePath)

      let data = fs.readFileSync(filePath)
      zip.file(slash(addPath), data)
    }
    let data = null
    zip.generateAsync({
      type: "nodebuffer",
      platform: "UNIX"
    }).then((content) => {
      data = content
    })
    return data
  })
  return zipped
}

// returns a flat array of absolute paths of all files recursively contained in the dir
function getFilePathsRecursiveSync(dir) {
  var results = []
  list = fs.readdirSync(dir)
  var pending = list.length
  if (!pending) return results

  for (let file of list) {
    file = path.resolve(dir, file)
    let stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      res = getFilePathsRecursiveSync(file)
      results = results.concat(res)
    } else {
      results.push(file)
    }
    if (!--pending) return results
  }

  return results
}

module.exports = getZippedFolderSync