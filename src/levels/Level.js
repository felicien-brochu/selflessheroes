import WorldLevel from '../world/Level'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import Reason from '../world/rules/conditions/Reason'
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

    this.installMessages()
  }

  installMessages() {
    if (this.name) {
      lang.pushMessage(this.getNameMessageKey(), this.name)
    }
    if (this.objective) {
      lang.pushMessage(this.getObjectiveMessageKey(), this.objective)
    }
  }

  getNameMessageKey() {
    return `level${this.id}_name`
  }

  getObjectiveMessageKey() {
    return `level${this.id}_objective`
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
      } else {
        generator = WorldGeneratorFactory.build(this.worldGenerator.type, this.worldGenerator.config)
      }

      generator.generate(world)
    }
  }

  getLossReasonTemplate(lossReason) {
    if (lossReason === Reason.tooManySteps) {
      return lang.text('loss_reason_too_many_steps')
    } else if (lossReason === Reason.allHeroEnded) {
      return lang.text('loss_reason_all_hero_ended')
    } else if (lossReason === Reason.allHeroDead) {
      return lang.text('loss_reason_all_hero_dead')
    } else if (lossReason === Reason.oneHeroDead) {
      return lang.text('loss_reason_one_hero_dead')
    }
    return null
  }

  get tilesetImagePath() {
    return tileset_image
  }
}