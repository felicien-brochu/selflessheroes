import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

/* speed: 62, length: 8
a:
step(e)
fireball(e)
if e == hole :
	if ne == floor :
		step(ne)
	else
		step(se)
	endif
endif
jump a
*/
/* length: 7
a:
fireball(e)
if ne == floor &&
  n == floor :
	step(ne)
endif
if se == floor &&
  s == floor :
	step(se)
endif
step(e)
jump a
*/



export default class Level9 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level9_name",
      objectiveTemplate: "level9_objective",
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 200,
      speedTarget: 62,
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
      lose: 'default_loss'
    })
  }
}