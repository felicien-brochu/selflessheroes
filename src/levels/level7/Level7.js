import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

/* speed: 4
if w != wall :
	step(sw)
	fireball(s)
else
	step(ne)
	if n == bonfire :
		fireball(n)
	endif
endif
*/

/* length: 5
step(sw)
fireball(s)
step(ne)
if n == bonfire :
	fireball(n)
endif
*/

export default class Level7 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level7_name",
      objectiveTemplate: "level7_objective",
      startingCode: "if w != wall :\n\tstep(w)\nelse\n\tstep(e)\nendif\n",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 4,
      lengthTarget: 5
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign', 'jump', 'anchor'],
      variables: 0,
      terrainTypes: ['wall', 'floor'],
      objectTypes: ['bonfire', 'hero'],
      valueFunctions: [],
      actionFunctions: ['step_once', 'fireball'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['object_type', 'terrain_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world, {
      win: 'all_bonfires',
      lose: ['one_hero_dead', 'or', 'default_loss']
    })
  }
}