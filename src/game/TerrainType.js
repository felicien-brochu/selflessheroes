export default class TerrainType {}

TerrainType.floor = Symbol('floorType')
TerrainType.wall = Symbol('wallType')
TerrainType.hole = Symbol('holeType')
TerrainType.void = Symbol('voidType')

Object.freeze(TerrainType)