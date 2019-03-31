import IdleAI from '../IdleAI'

export default class AIFactory {
  constructor() {}

  buildAI() {
    return new IdleAI()
  }
}