const fs = require('fs')
const glob = require('glob')
const path = require('path')
const argv = require('minimist')(process.argv.slice(2), {
  boolean: [
    "help",
  ],
  string: [
    "level",
  ],
  alias: {
    "help": ["h"],
    "level": ["l"],
  },
})

if (argv["help"]) {
  console.log(
    `
compressmaps compress level maps json files
Usage: node compressmaps.js [-l levelID]

  --help, -h                           Show this help message
  --level, -l                          Specific level id
`)
  process.exit(0)
}

const levelsPath = path.resolve(__dirname, '../src/levels/')
const levelID = argv["level"]
let mapFiles = []
if (levelID) {
  const mapFile = path.resolve(levelsPath, `level${levelID}/map${levelID}.json`)
  mapFiles.push(mapFile)
} else {
  // compress all maps
  mapFiles = glob.sync(levelsPath + '/level*/map*.json')
}
console.log("Compress:")
console.log(mapFiles)

mapFiles.forEach(mapFile => compressMap(mapFile))

function compressMap(mapFile) {
  let mapData = fs.readFileSync(mapFile, 'utf8')
  let map = JSON.parse(mapData)
  let nospaceSize = JSON.stringify(map).length

  for (let i = 0; i < map.layers.length; i++) {
    let layer = map.layers[i]

    if (layer.name !== 'camera' &&
      layer.name !== 'objects' &&
      layer.name !== 'types' &&
      layer.name !== 'ground' &&
      layer.name !== 'floor_shadow') {
      map.layers.splice(i, 1)
      i--
      continue
    }

    cleanLayer(layer)
  }

  let compressedData = JSON.stringify(map)
  let compressedSize = compressedData.length
  let compressRate = (nospaceSize - compressedSize) / nospaceSize
  compressRate = compressRate * 100
  compressRate = compressRate.toString().substring(0, 5)

  fs.writeFileSync(mapFile, compressedData, 'utf8')
  console.log(mapFile.replace(/^.*[\/\\]/, ''), ":", `${compressRate}%`, nospaceSize, '=>', compressedSize)
}

function cleanLayer(layer) {
  delete layer.opacity
  delete layer.visible
  delete layer.draworder

  if (layer.type === 'objectgroup') {
    cleanObjectLayer(layer)
  }
}

function cleanObjectLayer(layer) {
  for (i = 0; i < layer.objects.length; i++) {
    const object = layer.objects[i]

    delete object.visible
    delete object.point
    delete object.rotation
    delete object.name

    if (object.type !== 'frame') {
      delete object.width
      delete object.height
    }

    if (object.properties) {
      for (let property of object.properties) {
        delete property.type
      }
    }
  }
}