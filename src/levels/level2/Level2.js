import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level2 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level2_name",
      objectiveTemplate: "level2_objective",
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 2,
      lengthTarget: 2
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign', 'if', 'else', 'endif', 'jump', 'anchor'],
      variables: 0,
      terrainTypes: [],
      objectTypes: ['switch'],
      valueFunctions: [],
      actionFunctions: ['step_once'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['object_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world, {
      win: 'all_switches',
      lose: 'default_loss'
    })
  }
}