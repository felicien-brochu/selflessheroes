import WorldLevel from '../world/Level'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import DefaultLossReason from '../world/rules/conditions/DefaultLossReason'
import WorldGeneratorFactory from '../world/generator/WorldGeneratorFactory'
import BasicTutorialConfig from '../components/level/tutorial/BasicTutorialConfig'
import AdvancedTutorialConfig from '../components/level/tutorial/AdvancedTutorialConfig'

export default class Level extends WorldLevel {

  constructor(id, {
    mapConfig,
    name,
    objective,
    messages,
    bossTellsSomething,
    bossName,
    startingCode,
    startingEditorType,
    maxStep,
    speedTarget,
    lengthTarget,
    tutorialConfig,
    compilerConfig,
    ruleset,
    worldGenerator,
  }) {
    super(id, mapConfig, maxStep)
    this.name = name
    this.objective = objective
    this.messages = messages || null
    this.bossTellsSomething = !!bossTellsSomething
    this.bossName = bossName || null
    this.startingCode = startingCode || ''
    this.startingEditorType = startingEditorType || 'graph'
    this.speedTarget = speedTarget || 20
    this.lengthTarget = lengthTarget || 10
    this.tutorialConfig = tutorialConfig || null
    this.compilerConfig = compilerConfig || 'default'
    this.ruleset = ruleset || {
      win: [],
      lose: 'default_loss'
    }
    this.worldGenerator = worldGenerator
  }

  installMessages(lang) {
    let name = `level${this.id}`
    if (this.name) {
      name = this.name
    }
    lang.pushMessage(this.getNameMessageKey(), name)

    let objective = `objective of level${this.id}`
    if (this.objective) {
      objective = this.objective
    }
    lang.pushMessage(this.getObjectiveMessageKey(), objective)

    if (this.messages) {
      for (let message in this.messages) {
        if (this.messages.hasOwnProperty(message)) {
          lang.pushMessage(this.prefixMessageKey(message), this.messages[message])
        }
      }
    }
  }

  getNameMessageKey() {
    return this.prefixMessageKey('name')
  }

  getObjectiveMessageKey() {
    return this.prefixMessageKey('objective')
  }

  getBossTellMessageKey() {
    return this.prefixMessageKey('boss_tell')
  }

  prefixMessageKey(name) {
    return `level${this.id}_${name}`
  }

  get tutorial() {
    if (typeof this.tutorialConfig === 'string') {
      if (this.tutorialConfig === 'basic_tutorial') {
        return BasicTutorialConfig
      } else if (this.tutorialConfig === 'advanced_tutorial') {
        return AdvancedTutorialConfig
      }
    } else {
      return this.tutorialConfig
    }
  }

  buildCompilerConfig() {
    if (this.compilerConfig === 'default') {
      return CompilerConfig.getDefault()
    } else {
      return new CompilerConfig(this.compilerConfig)
    }
  }

  buildRuleset(world) {
    if (typeof this.ruleset.step === 'function' &&
      typeof this.ruleset.hasWon === 'function' &&
      typeof this.ruleset.hasLost === 'function' &&
      typeof this.ruleset.getLossReason === 'function') {
      return this.ruleset
    } else {
      return super.buildRuleset(world, this.ruleset)
    }
  }

  generateWorld(world) {
    if (this.worldGenerator) {
      let generator
      if (typeof this.worldGenerator.generate === 'function') {
        generator = this.worldGenerator
      } else if (Array.isArray(this.worldGenerator)) {
        generator = {
          generate: (world) => {
            for (let generatorConfig of this.worldGenerator) {
              WorldGeneratorFactory.build(generatorConfig.type, generatorConfig.config).generate(world)
            }
          }
        }
      } else {
        generator = WorldGeneratorFactory.build(this.worldGenerator.type, this.worldGenerator.config)
      }

      generator.generate(world)
    }
  }

  getLossReasonTemplate(lossReason) {
    if (!DefaultLossReason.has(lossReason)) {
      lossReason = this.prefixMessageKey(lossReason)
    }
    return lossReason
  }
}