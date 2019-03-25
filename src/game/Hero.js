import Character from './Character'
import IdleAI from './ai/IdleAI'
import UserAI from './ai/UserAI'
import {
  MoveAction,
  WaitAction
} from './CharacterAction'

export default class Hero extends Character {
  constructor(config, aiCode, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight)

    if (aiCode) {
      this.ai = new UserAI(world, this, aiCode)
    } else {
      this.ai = new IdleAI
    }
  }

  step() {
    this.lastAction = this.ai.step()
    return this.lastAction
  }
}