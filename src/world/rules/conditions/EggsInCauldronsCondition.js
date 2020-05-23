import Condition from './Condition'

export default class EggsInCauldronsCondition extends Condition {
  check(world) {
    for (let mapping of this.config.eggCauldronMap) {
      let cauldron = world.findWorldObjectByID(mapping.cauldron)
      for (let eggID of mapping.eggs) {
        if (!cauldron.items.find(item => item.id === eggID)) {
          return false
        }
      }
    }
    return true
  }
}