import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

/* speed: 247, length: 13
e:
a:
if e == floor :
	step(e)
	jump a
endif
b:
if s == floor :
	step(s)
	jump b
endif
c:
if w == floor :
	step(w)
	jump c
endif
d:
if n == floor :
	step(n)
	jump d
endif
jump e
*/


export default class Level102 extends Level {
  constructor(id) {
    super(id, {
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 2000,
      speedTarget: 247,
      lengthTarget: 13
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return new CompilerConfig({
      excludePrimary: ['assign'],
      variables: 0,
      terrainTypes: ['wall', 'floor'],
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