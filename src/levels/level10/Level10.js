import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

/* length: 8
a:
if ne != bonfire :
	if se == floor :
		step(se)
	endif
	if ne == floor :
		step(ne)
	endif
	step(e)
	jump a
endif
fireball(ne)
*/

/* speed: 69
a:
step(e)
if ne != bonfire :
	if e == hole :
		if ne == floor :
			step(ne)
		else
			step(se)
		endif
	endif
	jump a
endif
fireball(ne)
*/

export default class Level10 extends Level {
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
      win: 'all_bonfires',
      lose: ['one_hero_dead', 'or', 'default_loss']
    })
  }
}