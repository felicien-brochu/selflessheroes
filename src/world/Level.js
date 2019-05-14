import CompilerConfig from './ai/compile/CompilerConfig'
import DefaultRuleset from './rules/DefaultRuleset'

export default class Level {
  constructor(id, maxStep = 300) {
    this.id = id
    this.maxStep = maxStep
  }

  buildCompilerConfig() {
    return CompilerConfig.getDefault()
  }

  buildRuleset(world) {
    return new DefaultRuleset(world, this.maxStep)
  }

  getRootPath() {
    return `levels/level${this.id}`
  }

  get mapPath() {
    return `${this.getRootPath()}/map${this.id}.json`
  }

  get tilesetImagePath() {
    return `${this.getRootPath()}/tileset.png`
  }
}