import Condition from './Condition'

export default class EggOnMarkerCondition extends Condition {
  check() {
    for (let mapping of this.config.eggMarkerMap) {
      let egg = this.world.findWorldObjectByID(mapping.egg)
      let marker = this.world.findConfigObjectByID(mapping.marker)
      if (!egg || !marker) {
        return false
      }

      if (!!egg.owner || egg.x !== marker.x || egg.y !== marker.y) {
        return false
      }
    }
    return true
  }
}