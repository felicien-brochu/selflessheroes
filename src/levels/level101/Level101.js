import Level from '../Level'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

/* speed: 58
a:
step(e)
if se == wall :
	jump a
endif
step(se)
b:
step(s)
jump b
*/

/* length: 3
b:
step(e)
step(s)
jump b
*/


export default class Level101 extends Level {
  constructor(id) {
    super(id, {
      startingCode: "",
      startingEditorType: "graph",
      maxStep: 300,
      speedTarget: 58,
      lengthTarget: 3
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