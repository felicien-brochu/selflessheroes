const types = {
  boolean: Symbol('booleanType'),
  integer: Symbol('integerType'),
  objectType: Symbol('objectTypeType'),
  terrainType: Symbol('terrainTypeType'),
  direction: Symbol('directionType'),
  composite: Symbol('compositeType')
}
Object.freeze(types)

export default types