import Level from '../../world/Level'

export default class Level1 extends Level {
  constructor(id) {
    super(id, {
      name: "level1",
      objective: "level1 objective Do stuff yo",
      startingCode: "step(s)",
      startingEditorType: "graph",
      maxStep: 100,
      speedTarget: 100,
      lengthTarget: 5
    })

    Object.freeze(this)
  }

  buildCompilerConfig() {
    return CompilerConfig.getDefault()
  }

  buildRuleset(world) {
    return super.buildRuleset(world)
  }
}