import CustomAI from './CustomAI'

export default class AIFactory {
  constructor(statements, compilerConfig) {
    this.statements = statements
    this.compilerConfig = compilerConfig
  }

  buildAI(world, character) {
    return new CustomAI(this.statements, this.compilerConfig, world, character)
  }
}