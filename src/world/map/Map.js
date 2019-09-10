import TerrainType from './TerrainType'

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
      if (layer.name === 'types') {
        pathLayer = layer
      }
    }

    if (!pathLayer) {
      throw new Error("types layer is missing from the map object: " + JSON.stringify(this.config))
    }

    let terrains = {}

    for (let terrain of this.config.tilesets[0].terrains) {
      let type = TerrainType[terrain.name]
      if (type) {
        terrains[terrain.tile + 1] = type
      }
    }

    if (!Object.values(terrains).includes(TerrainType.floor) ||
      !Object.values(terrains).includes(TerrainType.wall) ||
      !Object.values(terrains).includes(TerrainType.hole)) {
      throw new Error("one of the required terrains are missing from the map object: " + JSON.stringify(this.config))
    }

    for (let i = 0; i < pathLayer.data.length; i++) {
      let tile = terrains[pathLayer.data[i]]
      if (!tile) {
        tile = TerrainType.void
      }
      this.tiles.push(tile)
    }
  }

  isHole(x, y) {
    return this.getTerrainTypeAt(x, y) === TerrainType.hole
  }

  isFloor(x, y) {
    return this.getTerrainTypeAt(x, y) === TerrainType.floor
  }

  isWall(x, y) {
    return this.getTerrainTypeAt(x, y) === TerrainType.wall
  }

  getTerrainTypeAt(x, y) {
    return this.tiles[y * this.width + x]
  }
}