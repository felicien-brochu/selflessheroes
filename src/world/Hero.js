import Character from './Character'
import ObjectType from './ObjectType'

export default class Hero extends Character {

  getObjectType() {
    return ObjectType.hero
  }
}