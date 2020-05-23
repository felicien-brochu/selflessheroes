import Condition from './Condition'

export default class EggOnMarkerCondition extends Condition {
  check(world) {
    for (let mapping of this.config.eggMarkerMap) {
      let egg = world.findWorldObjectByID(mapping.egg)
      let marker = world.findConfigObjectByID(mapping.marker)
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