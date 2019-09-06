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
    en: "Drop the %%icon icon-egg$%% eggs on the crosses",
    fr: "Dépose les %%icon icon-egg$%% œufs sur les croix",
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
    objectTypes: ['egg'],
    valueFunctions: [],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction'],
    rightComparisonExpressions: ['object_type']
  },

  ruleset: {
    win: [{
      type: 'egg_on_marker',
      config: {
        eggMarkerMap: [{
            egg: 17,
            marker: 28
          },
          {
            egg: 22,
            marker: 29
          },
          {
            egg: 23,
            marker: 30
          },
          {
            egg: 24,
            marker: 31
          },
        ]
      }
    }],
    lose: 'default_loss'
  }
}

export default level