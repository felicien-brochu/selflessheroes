import map from './map101.json'

const level = {
  mapConfig: map,
  name: {
    en: "Delivery",
    fr: "Livraison",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldrons",
    fr: "Mets les %%icon icon-egg$%% œufs dans les %%icon icon-cauldron$%% chaudrons",
  },

  maxStep: 50,
  speedTarget: 3,
  lengthTarget: 3,

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    actionFunctions: ['step_once', 'take', 'drop'],
  },

  ruleset: {
    win: [{
      type: 'eggs_in_cauldrons',
      config: {
        eggCauldronMap: [{
            eggs: [17],
            cauldron: 32
          },
          {
            eggs: [22],
            cauldron: 33
          },
          {
            eggs: [23],
            cauldron: 34
          },
          {
            eggs: [24],
            cauldron: 35
          },
        ]
      }
    }],
    lose: 'default_loss'
  }
}

export default level