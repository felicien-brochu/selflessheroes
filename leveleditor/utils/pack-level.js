const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const minimist = require('minimist')

module.exports = function packLevel(argv) {
  argv = minimist(argv, {})

  let levelDir = '.'
  if (argv._.length > 0) {
    levelDir = argv._[0]
  }
  levelDir = path.resolve(levelDir)

  let mapPath = path.resolve(levelDir, "map.json")
  if (!fs.existsSync(mapPath)) {
    console.log(`Cannot find file "${mapPath}"`)
    process.exit(1)
  }

  let mapConfig = compressMap(mapPath)
  let levelCode = importLevelCode(levelDir, mapConfig)
  let metadata = importMetadata(levelDir)

  let level = {
    hash: "local",
    level: levelCode,
    metadata: metadata
  }

  saveLevelFile(levelDir, level)
}

function saveLevelFile(levelDir, level) {
  let levelFile = path.resolve(levelDir, "level.shlv")
  fs.writeFileSync(levelFile, JSON.stringify(level))

  console.log(`saved level file: ${levelFile}`)
}

function importMetadata(levelDir) {
  const metadataFile = path.resolve(levelDir, "metadata.json")
  let metadata = fs.readFileSync(metadataFile, 'utf8')

  return JSON.parse(metadata)
}

function importLevelCode(levelDir, mapConfig) {
  const levelFile = path.resolve(levelDir, "level.js")
  let levelCode = fs.readFileSync(levelFile, 'utf8')

  levelCode = levelCode.replace('MAP_CONFIG', mapConfig)
  return levelCode
}

function compressMap(mapFile) {
  let mapData = fs.readFileSync(mapFile, 'utf8')

  let map = JSON.parse(mapData)
  let nospaceSize = JSON.stringify(map).length

  for (let property in map) {
    if (map.hasOwnProperty(property)) {
      if (
        property !== 'height' &&
        property !== 'width' &&
        property !== 'infinite' &&
        property !== 'layers' &&
        property !== 'orientation' &&
        property !== 'renderorder' &&
        property !== 'tiledversion' &&
        property !== 'tileheight' &&
        property !== 'tilewidth' &&
        property !== 'tilesets' &&
        property !== 'type' &&
        property !== 'version'
      ) {
        delete map[property]
      }
    }
  }

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

  console.log(`compress ${mapFile.replace(/^.*[\/\\]/, '')}: ${compressRate}% (${nospaceSize} => ${compressedSize})`)

  return compressedData
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