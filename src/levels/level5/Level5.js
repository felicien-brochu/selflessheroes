import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level5 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level5_name",
      objectiveTemplate: "level5_objective",
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 4,
      lengthTarget: 8
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign', 'jump', 'anchor'],
      variables: 0,
      terrainTypes: ['hole'],
      objectTypes: ['switch'],
      valueFunctions: [],
      actionFunctions: ['step_once'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['object_type', 'terrain_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world)
  }
}