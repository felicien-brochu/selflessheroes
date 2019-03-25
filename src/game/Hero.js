import Character from './Character'
import ObjectiveFinderAI from './ai/ObjectiveFinderAI'
import {
  MoveAction,
  WaitAction
} from './CharacterAction'

export default class Hero extends Character {
  constructor(config, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight)
    let objective
    this.ai = new ObjectiveFinderAI(world, this, )
  }

  step() {
    this.lastAction = this.ai.step()
    return this.lastAction
  }
}