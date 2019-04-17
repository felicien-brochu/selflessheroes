import AI from '../AI'
import ExpressionValue from './statements/ExpressionValue'

export default class CustomAI extends AI {
  constructor(statements, compilerConfig, world, character) {
    super(world, character)

    this.statements = statements
    this.compilerConfig = compilerConfig

    this.cursor = 0
    this.variables = {}
    this.initVariables()
    this.context = {
      world: this.world,
      character: this.character,
      variables: this.variables,
      lastGoto: null
    }
  }

  initVariables() {
    this.compilerConfig.getAllowedVariableIdentifiers().forEach(name => {
      this.variables[name] = ExpressionValue.integer(0)
    })
  }

  step() {
    while (this.cursor < this.statements.length) {
      let statement = this.statements[this.cursor]
      let {
        step,
        complete,
        goto,
        action
      } = statement.execute(this.getContext())

      if (goto) {
        this.context.lastGoto = goto
        this.cursor = this.statements.indexOf(goto)
      } else if (complete) {
        this.cursor++
      }

      if (step) {
        return action
      }
    }
  }

  getContext() {
    return this.context
  }
}