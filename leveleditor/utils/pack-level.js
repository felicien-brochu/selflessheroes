const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const minimist = require('minimist')

module.exports = function packLevel(argv) {
  argv = minimist(argv, {
    boolean: [
      "help",
      "watch",
    ],
    alias: {
      "help": ["h"],
      "watch": ["w"],
    }
  })

  if (argv["help"]) {
    console.log(
      `
 pack-level packages a Selfless Heroes level (.shlv)

 Usage: shutils pack-level <level-directory> [--options]

  --help, -h              Show this help message

  --watch, -w             Watch changes of level.js, map.json and metadata.json and
                          repackages the level as soon as one of these files changes
	`)
    return
  }

  let levelDir = '.'
  if (argv._.length > 0) {
    levelDir = argv._[0]
  }
  levelDir = path.resolve(levelDir)

  if (!fs.existsSync(levelDir)) {
    console.log(`error: directory ${levelDir} does not exist`)
    return
  }

  const mapFile = path.resolve(levelDir, "map.json")
  const levelCodeFile = path.resolve(levelDir, "level.js")
  const metadataFile = path.resolve(levelDir, "metadata.json")

  if (argv.watch) {
    const watchedFiles = [mapFile, levelCodeFile, metadataFile]

    watchedFiles.forEach(file => {
      fs.watchFile(file, {
        interval: 1000
      }, (curr, prev) => {
        if (curr.mtime > prev.mtime) {
          console.log(`${file} has changed ==> pack level`)
          pack({
            levelDir,
            mapFile,
            levelCodeFile,
            metadataFile
          })
          console.log()
        }
      })
    })

    console.log("watching files:", watchedFiles)
  }
}

function pack({
  levelDir,
  mapFile,
  levelCodeFile,
  metadataFile
}) {
  try {
    [mapFile, levelCodeFile, metadataFile].forEach(file => {
      if (!fs.existsSync(file)) {
        throw new Error(`Cannot find file "${file}"`)
      }
    })

    let mapConfig = compressMap(mapFile)
    let levelCode = importLevelCode(levelCodeFile, mapConfig)
    let metadata = importMetadata(metadataFile)

    let level = {
      hash: "local",
      level: levelCode,
      metadata: metadata
    }

    saveLevelFile(levelDir, level)
  } catch (e) {
    console.log(e)
  }
}

function saveLevelFile(levelDir, level) {
  let levelFile = path.resolve(levelDir, "level.shlv")
  fs.writeFileSync(levelFile, JSON.stringify(level))

  console.log(`saved level file: ${levelFile}`)
}

function importMetadata(metadataFile) {
  try {
    let metadataContent = fs.readFileSync(metadataFile, 'utf8')
    return JSON.parse(metadataContent)
  } catch (e) {
    throw new Error('metadata.json: ' + e.message, e)
  }
}

function importLevelCode(levelCodeFile, mapConfig) {
  try {
    let levelCode = fs.readFileSync(levelCodeFile, 'utf8')
    let mapConfigTemplates = levelCode.match(/\bMAP_CONFIG\b/g)
    if (!mapConfigTemplates) {
      throw new Error('level object must contain a MAP_CONFIG keyword in order to insert the map during the level packaging')
    }
    if (mapConfigTemplates.length > 1) {
      throw new Error('MAP_CONFIG found more than once')
    }
    return levelCode.replace('MAP_CONFIG', mapConfig)
  } catch (e) {
    throw new Error('level.js: ' + e.message, e)
  }
}

function compressMap(mapFile) {
  try {
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
  } catch (e) {
    throw new Error('map.json: ' + e.message, e)
  }
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