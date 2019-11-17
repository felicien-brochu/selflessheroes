import map from './map301.json'

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
    en: "Fill the pyramid with your %%icon icon-hero$%% heroes.\n\n%%icon mdi mdi-information-outline$%% Now your heroes are able to %%statement branching-statement$clone%% themselves. Check the help about %%statement branching-statement$clone%% to better understand how it works.\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: no hero must die.",
    fr: "Remplis la pyramide avec tes %%icon icon-hero$%% héros.\n\n%%icon mdi mdi-information-outline$%% Maintenant les héros savent se cloner. Consulte l'aide à propos de %%statement branching-statement$clone%% pour mieux comprendre comment ça marche.\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: aucun héro ne doit mourir.",
  },

  maxStep: 200,
  speedTarget: 26,
  lengthTarget: 4,

  compilerConfig: {
    excludePrimary: [],
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