import Level from '../../world/Level'

export default class Level1 extends Level {
  constructor(id) {
    super(id, {
      name: "level1",
      objective: "level1 objective Do stuff yo",
      startingCode: "step(s)",
      startingEditorType: "graph",
      maxStep: 500,
      speedTarget: 100,
      lengthTarget: 5
    })
  }

  buildCompilerConfig() {
    return CompilerConfig.getDefault()
  }

  buildRuleset(world) {
    return super.buildRuleset(world)
  }
}