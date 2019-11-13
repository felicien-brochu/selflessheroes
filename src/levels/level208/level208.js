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
    en: "Move the %%icon icon-egg$%% eggs right of as many squares as their number to discover the hidden image\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: this level is really very difficult\n(I had trouble finishing it myself 😅)",
    fr: "Déplace les %%icon icon-egg$%% œufs vers la droite d'autant de cases que leur numéro pour découvrir l'image cachée\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: ce niveau est vraiment très difficile\n(moi-même j'ai eu du mal à le finir 😅)",
  },

  maxStep: 10000,
  speedTarget: 1596,
  lengthTarget: 50,

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