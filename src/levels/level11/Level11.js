import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

/* length: 9
a:
if here != switch :
	step(e)
	jump a
endif
step(n)
step(n)
b:
if ne == floor :
	step(ne)
endif
step(e)
jump b
*/

/* speed: 57
a:
if e != switch :
	step(e)
	step(e)
	jump a
endif
step(e)
step(n)
step(n)
b:
if ne == floor :
	step(ne)
endif
step(e)
step(e)
jump b
*/

export default class Level11 extends Level {
  constructor(id) {
    super(id, {
      nameTemplate: "level11_name",
      objectiveTemplate: "level11_objective",
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 300,
      speedTarget: 57,
      lengthTarget: 9
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign'],
      variables: 0,
      terrainTypes: ['hole', 'floor', 'wall'],
      objectTypes: ['switch', 'spikes', 'nothing'],
      valueFunctions: [],
      actionFunctions: ['step_once'],
      leftComparisonExpressions: ['direction'],
      rightComparisonExpressions: ['terrain_type', 'object_type']
    })
  }

  buildRuleset(world) {
    return super.buildRuleset(world, {
      win: ['all_npc_dead'],
      lose: ['one_hero_dead', 'or', 'default_loss']
    })
  }
}