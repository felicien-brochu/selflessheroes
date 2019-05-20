import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level4 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level4_name",
      objectiveTemplate: "level4_objective",
      startingCode: "if e == hero:\n\tstep(w)\nendif\n",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 4,
      lengthTarget: 6
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign', 'jump', 'anchor'],
      variables: 0,
      terrainTypes: [],
      objectTypes: ['hero', 'switch'],
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