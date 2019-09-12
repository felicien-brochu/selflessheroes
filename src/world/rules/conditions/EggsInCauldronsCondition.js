import Condition from './Condition'

export default class EggsInCauldronsCondition extends Condition {
  check() {
    for (let mapping of this.config.eggCauldronMap) {
      let cauldron = this.world.findWorldObjectByID(mapping.cauldron)
      for (let eggID of mapping.eggs) {
        if (!cauldron.items.find(item => item.id === eggID)) {
          return false
        }
      }
    }
    return true
  }
}