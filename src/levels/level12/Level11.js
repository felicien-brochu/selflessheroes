import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level11 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level10_name",
      objectiveTemplate: "level10_objective",
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 200,
      speedTarget: 69,
      lengthTarget: 8
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign'],
      variables: 0,
      terrainTypes: ['hole', 'floor', 'wall'],
      objectTypes: ['bonfire'],
      valueFunctions: [],
      actionFunctions: ['step_once', 'fireball'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['terrain_type', 'object_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world, {
      win: [],
      lose: []
    })
  }
}