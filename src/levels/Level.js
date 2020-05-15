import WorldLevel from '../world/Level'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import DefaultLossReason from '../world/rules/conditions/DefaultLossReason'
import WorldGeneratorFactory from '../world/generator/WorldGeneratorFactory'
import BasicTutorialConfig from '../components/level/tutorial/BasicTutorialConfig'
import AdvancedTutorialConfig from '../components/level/tutorial/AdvancedTutorialConfig'

export default class Level extends WorldLevel {

  constructor(id, {
    mapConfig,
    messages,
    bossTellsSomething,
    bossName,
    startingCode,
    startingEditorType,
    maxStep,
    speedTarget,
    lengthTarget,
    deterministic,
    tutorialConfig,
    compilerConfig,
    ruleset,
    worldGenerator,
  }, source = 'campaign') {
    super(id, mapConfig, maxStep)
    this.messages = messages || null
    this.bossTellsSomething = !!bossTellsSomething
    this.bossName = bossName || null
    this.startingCode = startingCode || ''
    this.startingEditorType = startingEditorType || 'graph'
    this.speedTarget = speedTarget || 20
    this.lengthTarget = lengthTarget || 10
    this.deterministic = !!deterministic
    this.tutorialConfig = tutorialConfig || null
    this.compilerConfig = compilerConfig || 'default'
    this.ruleset = ruleset || {
      win: [],
      lose: 'default_loss'
    }
    this.worldGenerator = worldGenerator
    this.source = source
  }

  installMessages(lang) {
    let name = `level${this.id}`
    lang.pushMessage(this.getNameMessageKey(), name)

    let objective = `objective of level${this.id}`
    lang.pushMessage(this.getObjectiveMessageKey(), objective)

    if (this.messages) {
      for (let languageKey in this.messages) {
        if (this.messages.hasOwnProperty(languageKey)) {
          for (let messageKey in this.messages[languageKey]) {
            if (this.messages[languageKey].hasOwnProperty(messageKey)) {
              lang.pushMessage(this.prefixMessageKey(messageKey), this.messages[languageKey][messageKey], languageKey)
            }
          }
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

  prefixMessageKey(key) {
    return `level${this.id}_${key}`
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