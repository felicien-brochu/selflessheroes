import WorldLevel from '../world/Level'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import DefaultRuleset from '../world/rules/DefaultRuleset'
import lang from '../lang'

export default class Level extends WorldLevel {

  constructor(id, {
    nameTemplate,
    objectiveTemplate,
    startingCode,
    startingEditorType,
    maxStep,
    speedTarget,
    lengthTarget
  }) {
    super(id, maxStep)
    this.nameTemplate = nameTemplate
    this.objectiveTemplate = objectiveTemplate || 'no-text'
    this.startingCode = startingCode || ''
    this.startingEditorType = startingEditorType || 'graph'
    this.speedTarget = speedTarget || 20
    this.lengthTarget = lengthTarget || 10
  }

  get name() {
    let name = `level${this.id}`
    if (this.nameTemplate) {
      name = lang.text(this.nameTemplate)
    }
    return name
  }

  get objective() {
    let objective = 'no-text objective'
    if (this.objectiveTemplate) {
      objective = lang.text(this.objectiveTemplate)
    }
    return objective
  }

  getLossReasonTemplate(lossReason) {
    if (lossReason === DefaultRuleset.lossReasonTooManySteps) {
      return lang.text('loss_reason_too_many_steps')
    } else if (lossReason === DefaultRuleset.lossReasonAllHeroEnded) {
      return lang.text('loss_reason_all_hero_ended')
    }
    return null
  }
}