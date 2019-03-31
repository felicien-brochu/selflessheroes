import Character from './Character'
import IdleAI from './ai/IdleAI'
import ObjectiveFinderAI from './ai/ObjectiveFinderAI'
import {
  MoveAction,
  WaitAction
} from './CharacterAction'

export default class Hero extends Character {
  constructor(config, aiFactory, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight)

    if (aiFactory) {
      this.ai = aiFactory.buildAI()
    } else {
      this.ai = new ObjectiveFinderAI(world, this)
    }
  }

  step() {
    this.lastAction = this.ai.step()
    return this.lastAction
  }
}