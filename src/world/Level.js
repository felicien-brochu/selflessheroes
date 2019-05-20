import CompilerConfig from './ai/compile/CompilerConfig'
import CustomRuleset from './rules/CustomRuleset'
import DefaultRuleset from './rules/DefaultRuleset'

export default class Level {
  constructor(id, maxStep = 300) {
    this.id = id
    this.maxStep = maxStep
  }

  buildCompilerConfig() {
    return CompilerConfig.getDefault()
  }

  buildRuleset(world, config) {
    if (config) {
      return new CustomRuleset(world, config)
    }
    return new DefaultRuleset(world)
  }

  getRootPath() {
    return `levels/level${this.id}`
  }

  get mapPath() {
    return `${this.getRootPath()}/map${this.id}.json`
  }
}