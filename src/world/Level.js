import CompilerConfig from './ai/compile/CompilerConfig'
import CustomRuleset from './rules/CustomRuleset'
import DefaultRuleset from './rules/DefaultRuleset'

export default class Level {
  constructor(id, mapConfig, maxStep = 300) {
    this.id = id
    this.mapConfig = typeof mapConfig === 'string' ? JSON.parse(mapConfig) : mapConfig
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

  generateWorld(world) {}
}