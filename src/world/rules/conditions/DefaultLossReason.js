export default class DefaultLossReason {
  static has(reason) {
    for (let defaultReason in DefaultLossReason.reasons) {
      if (DefaultLossReason.reasons.hasOwnProperty(defaultReason) &&
        reason === DefaultLossReason.reasons[defaultReason]) {
        return true
      }
    }
    return false
  }
}

DefaultLossReason.reasons = {
  tooManySteps: 'loss_reason_too_many_steps',
  allHeroEnded: 'loss_reason_all_hero_ended',
  allHeroDead: 'loss_reason_all_hero_dead',
  oneHeroDead: 'loss_reason_one_hero_dead',
}

Object.freeze(DefaultLossReason.reasons)