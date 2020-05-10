var action = tiled.registerAction("SelflessHeroesExporter", function(action) {
  try {
    exportLevel()
  } catch (e) {
    tiled.error(e)
    tiled.alert(e)
  }
})

action.text = "Export Selfless Heroes level"
action.icon = "selflessheroes-exporter.svg"
action.shortcut = "Ctrl+K"

tiled.extendMenu("Edit", [{
    action: "SelflessHeroesExporter",
    before: "SelectAll"
  },
  {
    separator: true
  }
]);

function exportLevel() {
  tiled.trigger("Export");
  const fileName = tiled.activeAsset.fileName
  const fileNameNoExt = fileName.substring(0, fileName.length - 4);
  const workingDir = fileName.replace(/[\/\\][^\/\\]+\.tmx$/, '')

  let mapConfig = compressMap(fileNameNoExt + ".json");
  let levelCode = importLevelCode(workingDir, mapConfig)
  let metadata = importMetadata(workingDir)

  let level = {
    hash: "local",
    level: levelCode,
    metadata: metadata
  }

  saveLevelFile(workingDir, level)
}

function saveLevelFile(workingDir, level) {
  let levelFilePath = workingDir + '/level.shlv'
  let levelExportFile = new TextFile(levelFilePath, TextFile.WriteOnly)
  levelExportFile.write(JSON.stringify(level))
  levelExportFile.commit()

  tiled.log(`saved level file: ${levelFilePath}`)
}

function importMetadata(workingDir) {
  const metadataFileName = workingDir + "/metadata.json"
  let metadataFile = new TextFile(metadataFileName, TextFile.ReadOnly)
  let metadata = metadataFile.readAll()
  metadataFile.close()

  return JSON.parse(metadata)
}

function importLevelCode(workingDir, mapConfig) {
  const levelFileName = workingDir + "/level.js"
  let levelFile = new TextFile(levelFileName, TextFile.ReadOnly)
  let levelCode = levelFile.readAll()
  levelFile.close()

  levelCode = levelCode.replace('MAP_CONFIG', mapConfig)
  return levelCode
}

function compressMap(mapFile) {
  let uncompressedFile = new TextFile(mapFile, TextFile.ReadOnly)
  let mapData = uncompressedFile.readAll()
  uncompressedFile.close()

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

  tiled.log(`compress ${mapFile.replace(/^.*[\/\\]/, '')}: ${compressRate}% (${nospaceSize} => ${compressedSize})`)

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