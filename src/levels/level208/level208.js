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
    en: "Move the %%icon icon-egg$%% eggs right of as many squares as their number to discover the hidden image (if the number is negative, move them left)\n\n%%icon mdi mdi-information-outline$%% You can %%statement action-statement$write%% anything you want on %%icon icon-egg$%% eggs",
    fr: "Déplace les %%icon icon-egg$%% œufs vers la droite d'autant de cases que leur numéro pour découvrir l'image cachée (si le nombre est négatif, déplace les vers la gauche)\n\n%%icon mdi mdi-information-outline$%% Tu peux %%statement action-statement$écrire%% ce que tu veux sur les %%icon icon-egg$%% œufs",
  },

  maxStep: 10000,
  speedTarget: 550,
  lengthTarget: 18,

  compilerConfig: {
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['hero', 'egg', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
    valueFunctions: ['set', 'calc'],
    maxInteger: 20,
    minInteger: -20,
    variables: 1,
    leftComparisonExpressions: ['direction', 'myitem', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer', 'myitem', 'variable']
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level