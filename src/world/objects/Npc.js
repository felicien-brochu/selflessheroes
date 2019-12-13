import Character from './Character'
import ObjectType from './ObjectType'
import NpcAIFactory from '../ai/NpcAIFactory'

export default class Npc extends Character {
  constructor(config, world) {
    config = Object.assign({
      race: '',
      yOffset: 0,
    }, config)

    super(config, world)
  }

  getObjectType() {
    return ObjectType.npc
  }

  shallowCopy() {
    let copy = super.shallowCopy()
    return Object.assign(copy, {
      race: this.race
    })
  }

  clone(direction, config) {
    let cloneConfig = {
      ...this.config,
      id: this.world.getAvailableObjectID()
    }
    cloneConfig.item = null

    if (config.aiConfig) {
      let aiConfigID = this.world.getAvailableObjectID()
      let aiConfig = this.world.createObject('ai', {
        id: aiConfigID,
        ...config.aiConfig
      })
      cloneConfig.aiConfig = aiConfigID
    }

    let clonedCharacter = new this.constructor(cloneConfig, this.world)
    clonedCharacter.ai = NpcAIFactory.buildAI(this.world, clonedCharacter)
    clonedCharacter.x = this.x + direction.dx
    clonedCharacter.y = this.y + direction.dy

    return clonedCharacter
  }
}