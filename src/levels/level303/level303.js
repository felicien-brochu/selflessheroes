import map from './map303.json'

const winCondition = {
  check() {
    for (let y = 0; y < this.world.map.height; y++) {
      for (let x = 0; x < this.world.map.width; x++) {
        if (this.world.map.isFloor(x, y)) {
          if (this.world.getCharactersAt(x, y).length === 0) {
            return false
          }
        }
      }
    }
    return true
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Pyramid",
    fr: "Pyramide",
  },
  objective: {
    en: "Fill the pyramid with your %%icon icon-hero$%% heroes.\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: in this level, if a cloning action fails, the hero trying to clone himself will die.",
    fr: "Remplis la pyramide avec tes %%icon icon-hero$%% héros.\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: dans ce niveau, si un clonage échoue, le héro qui essayait de se cloner mourra.",
  },

  maxStep: 200,
  speedTarget: 17,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: true,
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'nothing'],
    actionFunctions: [],
    valueFunctions: [],
    variables: 0,
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level