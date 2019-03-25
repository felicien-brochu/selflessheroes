import Character from './Character'
import PathFinderAI from './ai/PathFinderAI'
import {
  MoveAction,
  WaitAction
} from './CharacterAction'

export default class Hero extends Character {
  constructor(config, tileWidth, tileHeight, world) {
    super(config, tileWidth, tileHeight)
    this.ai = new PathFinderAI(world, this)
  }

  step() {
    this.lastAction = this.ai.step()
    return this.lastAction
  }
}