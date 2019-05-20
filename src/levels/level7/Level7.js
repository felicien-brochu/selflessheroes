import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default class Level7 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level7_name",
      objectiveTemplate: "level7_objective",
      startingCode: "if w != wall :\n\tstep(w)\nelse\n\tstep(e)\nendif\n",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 5,
      lengthTarget: 7
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
      rightComparisonExpressions: ['terrain_type', 'object_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world, {
      win: 'all_bonfires',
      lose: ['one_hero_dead', 'or', 'default_loss']
    })
  }
}