export default class Map {
  constructor(config) {
    this.config = config
    this.tiles = []
    this.width = config.width
    this.height = config.height
    this.parseConfig()
  }

  parseConfig() {
    let pathLayer = null,
      objectsLayer = null
    for (let layer of this.config.layers) {
      if (layer.name === 'path') {
        pathLayer = layer
      }
    }

    if (!pathLayer) {
      throw new Error("path layer is missing from the map object: " + JSON.stringify(config))
    }

    let floorTile = -1,
      outsideTile = -1

    for (let terrain of this.config.tilesets[0].terrains) {
      if (terrain.name === 'floor') {
        floorTile = terrain.tile + 1
      } else if (terrain.name === 'outside') {
        outsideTile = terrain.tile + 1
      }
    }

    if (floorTile === -1 || outsideTile === -1) {
      throw new Error("One of the required terrains are missing from the map object: " + JSON.stringify(config))
    }

    for (let i = 0; i < pathLayer.data.length; i++) {
      let tile = 0
      if (pathLayer.data[i] === floorTile) {
        tile = 1
      }
      this.tiles.push(tile)
    }
  }

  isOutside(x, y) {
    return this.tiles[y * this.width + x] === 0
  }

  isInside(x, y) {
    return !this.isOutside(x, y)
  }
}