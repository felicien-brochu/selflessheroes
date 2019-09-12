import WorldLevel from '../world/Level'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import DefaultLossReason from '../world/rules/conditions/DefaultLossReason'
import WorldGeneratorFactory from '../world/generator/WorldGeneratorFactory'
import tileset_image from './maps/tileset.png'
import lang from '../lang'
import BasicTutorialConfig from '../components/level/tutorial/BasicTutorialConfig'
import AdvancedTutorialConfig from '../components/level/tutorial/AdvancedTutorialConfig'

export default class Level extends WorldLevel {

  constructor(id, {
    name,
    objective,
    startingCode,
    startingEditorType,
    maxStep,
    speedTarget,
    lengthTarget,
    tutorialConfig,
    compilerConfig,
    ruleset,
    worldGenerator,
    messages,
  }) {
    super(id, maxStep)
    this.name = name
    this.objective = objective
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
    this.messages = messages || null

    this.installMessages()
  }

  installMessages() {
    if (this.name) {
      lang.pushMessage(this.getNameMessageKey(), this.name)
    }
    if (this.objective) {
      lang.pushMessage(this.getObjectiveMessageKey(), this.objective)
    }
    if (this.messages) {
      for (let message in this.messages) {
        if (this.messages.hasOwnProperty(message)) {
          lang.pushMessage(this.prefixMessageName(message), this.messages[message])
        }
      }
    }
  }

  getNameMessageKey() {
    return this.prefixMessageName('name')
  }

  getObjectiveMessageKey() {
    return this.prefixMessageName('objective')
  }

  prefixMessageName(name) {
    return `level${this.id}_${name}`
  }

  getName() {
    let name = `level${this.id}`
    if (this.name) {
      name = lang.text(this.getNameMessageKey())
    }
    return name
  }

  getObjective() {
    let objective = lang.text('no_text')
    if (this.objective) {
      objective = lang.text(this.getObjectiveMessageKey())
    }
    return objective
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
    let message
    if (DefaultLossReason.has(lossReason)) {
      message = lang.text(lossReason)
    } else {
      message = lang.text(this.prefixMessageName(lossReason))
    }
    return message
  }

  get tilesetImagePath() {
    return tileset_image
  }
}