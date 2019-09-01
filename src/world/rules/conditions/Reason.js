const reasons = {
  tooManySteps: Symbol('reason_too_many_steps'),
  allHeroEnded: Symbol('reason_all_hero_ended'),
  allHeroDead: Symbol('reason_all_hero_dead'),
  oneHeroDead: Symbol('reason_one_hero_dead'),

  allSwitchesEnabled: Symbol('reason_all_switches_enabled'),
  allBonfiresEnabled: Symbol('reason_all_bonfires_enabled'),
  allNpcDead: Symbol('reason_all_npc_dead'),
}

Object.freeze(reasons)

export default reasons