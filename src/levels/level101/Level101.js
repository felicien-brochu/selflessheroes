import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level101 extends Level {
  constructor(id) {
    super(id, {
      startingCode: "step(s)",
      startingEditorType: "graph",
      maxStep: Infinity,
      speedTarget: 100,
      lengthTarget: 5
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign'],
      variables: 0,
      terrainTypes: ['wall'],
      objectTypes: ['switch'],
      valueFunctions: [],
      actionFunctions: ['step_once'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['terrain_type', 'object_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world)
  }
}