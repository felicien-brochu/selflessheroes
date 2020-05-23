import CustomRuleset from './CustomRuleset'

export default class DefaultRuleset extends CustomRuleset {
  constructor(world) {
    super(world, {
      win: 'all_switches',
      lose: 'default'
    })
  }
}