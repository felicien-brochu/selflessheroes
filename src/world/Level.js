import CompilerConfig from './ai/compile/CompilerConfig'
import DefaultRuleset from './rules/DefaultRuleset'

export default class Level {
  constructor(id, {
    name,
    objective,
    startingCode,
    startingEditorType,
    maxStep,
    speedTarget,
    lengthTarget
  }) {
    this.id = id
    this.name = name
    this.objective = objective
    this.startingCode = startingCode
    this.startingEditorType = startingEditorType
    this.maxStep = maxStep
    this.speedTarget = speedTarget
    this.lengthTarget = lengthTarget
  }

  buildCompilerConfig() {
    return CompilerConfig.getDefault()
  }

  buildRuleset(world) {
    return new DefaultRuleset(world)
  }

  getRootPath() {
    return `levels/level${this.id}`
  }

  get mapPath() {
    return `${this.getRootPath()}/map.json`
  }

  get tilesetImagePath() {
    return `${this.getRootPath()}/tileset.png`
  }
}