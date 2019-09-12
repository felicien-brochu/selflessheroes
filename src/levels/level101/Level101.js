/* speed: 3, length: 3
take(e)
step_once(se)
drop(s)
*/

const level = {
  name: {
    en: "Delivery",
    fr: "Livraison",
  },
  objective: {
    en: "Put the %%icon icon-egg$%% eggs in the %%icon icon-cauldron$%% cauldrons",
    fr: "Mets les %%icon icon-egg$%% œufs dans les %%icon icon-cauldron$%% chaudrons",
  },
  startingCode: "",
  startingEditorType: "graph",
  maxStep: 50,
  speedTarget: 3,
  lengthTarget: 3,

  compilerConfig: {
    excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor'],
    variables: 0,
    terrainTypes: [],
    objectTypes: [],
    valueFunctions: [],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: [],
    rightComparisonExpressions: []
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