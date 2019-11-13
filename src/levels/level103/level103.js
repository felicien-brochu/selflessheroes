import map from './map103.json'

const level = {
  mapConfig: map,
  name: {
    en: "Human chain",
    fr: "Chaîne humaine",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% egg into the %%icon icon-cauldron$%% cauldron",
    fr: "Mets l'%%icon icon-egg$%% œuf dans le %%icon icon-cauldron$%% chaudron",
  },

  maxStep: 100,
  speedTarget: 22,
  lengthTarget: 5,

  compilerConfig: {
    excludePrimary: ['assign', 'clone'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'nothing'],
    actionFunctions: ['take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['terrain_type', 'object_type']
  },

  ruleset: {
    win: [{
      type: 'eggs_in_cauldrons',
      config: {
        eggCauldronMap: [{
          eggs: [26],
          cauldron: 30
        }]
      }
    }],
    lose: 'default_loss'
  }
}

export default level