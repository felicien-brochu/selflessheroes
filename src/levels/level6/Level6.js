import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level6 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level6_name",
      objectiveTemplate: "level6_objective",
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
      excludePrimary: ['assign', 'jump', 'anchor'],
      variables: 0,
      terrainTypes: ['wall', 'floor'],
      objectTypes: ['bonfire'],
      valueFunctions: [],
      actionFunctions: ['step_once', 'fireball'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['object_type', 'terrain_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world, {
      win: 'all_bonfires',
      lose: 'default_loss'
    })
  }
}