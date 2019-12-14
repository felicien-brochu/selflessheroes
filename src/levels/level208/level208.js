import map from './map208.json'

const winCondition = {
  beforeStart() {
    this.markers = this.world.configObjects.filter(o => o.type === 'marker')
  },

  check() {
    return this.world.eggs.every(egg => {
      return !egg.owner && this.markers.find(marker => marker.x === egg.x && marker.y === egg.y)
    })
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Pixel art 3",
    fr: "Pixel art 3",
  },
  objective: {
    en: "Move the %%icon icon-egg$%% eggs right of as many squares as their number to discover the hidden image.",
    fr: "Déplace les %%icon icon-egg$%% œufs vers la droite d'autant de cases que leur numéro pour découvrir l'image cachée.",
  },

  maxStep: 10000,
  speedTarget: 1001,
  lengthTarget: 17,

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    valueFunctions: ['set', 'calc'],
    maxInteger: 2,
    minInteger: 0,
    variables: 8,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer', 'myitem', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level