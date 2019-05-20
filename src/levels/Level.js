import WorldLevel from '../world/Level'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import Reason from '../world/rules/conditions/Reason'
import tileset_image from './maps/tileset.png'
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
    this.objectiveTemplate = objectiveTemplate
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
    let objective = lang.text('no_text')
    if (this.objectiveTemplate) {
      objective = lang.text(this.objectiveTemplate)
    }
    return objective
  }

  getLossReasonTemplate(lossReason) {
    if (lossReason === Reason.tooManySteps) {
      return lang.text('loss_reason_too_many_steps')
    } else if (lossReason === Reason.allHeroEnded) {
      return lang.text('loss_reason_all_hero_ended')
    } else if (lossReason === Reason.allHeroDead) {
      return lang.text('loss_reason_all_hero_dead')
    }
    return null
  }

  get tilesetImagePath() {
    return tileset_image
  }
}