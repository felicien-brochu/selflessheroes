import CompilerConfig from './ai/compile/CompilerConfig'
import DefaultRuleset from './rules/DefaultRuleset'
import lang from '../lang'

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
    this.name = name || `level${id}`
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
    return new DefaultRuleset(world, this.maxStep)
  }

  getLossReasonTemplate(lossReason) {
    console.log("###reas", lossReason, DefaultRuleset.lossReasonTooManySteps)
    if (lossReason === DefaultRuleset.lossReasonTooManySteps) {
      return lang.text('loss_reason_too_many_steps')
    } else
    if (lossReason === DefaultRuleset.lossReasonAllHeroEnded) {
      return lang.text('loss_reason_all_hero_ended')
    }
    return null
  }

  getRootPath() {
    return `levels/level${this.id}`
  }

  get mapPath() {
    return `${this.getRootPath()}/map${this.id}.json`
  }

  get tilesetImagePath() {
    return `${this.getRootPath()}/tileset${this.id}.png`
  }
}