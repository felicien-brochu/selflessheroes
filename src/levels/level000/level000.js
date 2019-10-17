import map from './map000.json'

const level = {
  mapConfig: map,
  startingCode: "step(s)\nstep(s)\n",
  startingEditorType: "graph",
  maxStep: Infinity,
  speedTarget: 3,
  lengthTarget: 3,
  compilerConfig: {
    excludePrimary: [],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['nothing', 'hero', 'egg', 'cauldron', 'bonfire', 'npc', 'switch', 'spikes'],
    actionFunctions: ['step', 'fireball', 'take', 'drop', 'write'],
    valueFunctions: ['set', 'calc', 'nearest'],
    variables: 5,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'direction', 'myitem', 'variable']
  },
}

export default level