import AI from '../AI'
import ExpressionValue from './statements/ExpressionValue'
import AnchorStatement from './statements/AnchorStatement'
import EmptyStatement from './statements/EmptyStatement'

export default class CustomAI extends AI {
  constructor(statements, compilerConfig, world, character) {
    super(world, character)

    this.statements = statements
    this.compilerConfig = compilerConfig

    this.cursor = 0
    this.lastActionCursor = 0
    this.lastActionStatement = null
    this.variables = {}
    this.initVariables()
    this.context = {
      world: this.world,
      character: this.character,
      variables: this.variables,
      lastGoto: null,
      rng: Math.random
    }
  }

  initVariables() {
    this.compilerConfig.getAllowedVariableIdentifiers().forEach(name => {
      this.variables[name] = ExpressionValue.integer(0)
    })
  }

  step(rng) {
    let res = null
    while (this.cursor < this.statements.length) {
      let statement = this.statements[this.cursor]
      let {
        step,
        complete,
        goto,
        action
      } = statement.execute(this.getContext(rng))

      if (step) {
        this.lastActionCursor = this.cursor
        this.lastActionStatement = statement
      }

      if (goto) {
        this.context.lastGoto = goto
        this.cursor = this.statements.indexOf(goto)
      } else if (complete) {
        this.cursor++
      }

      if (step) {
        res = action
        break
      }
    }

    return res
  }

  getContext(rng) {
    this.context.rng = rng
    return this.context
  }

  getDebugContext() {
    return {
      ...this.context,
      cursor: this.lastActionCursor,
      cursorStatement: this.lastActionStatement
    }
  }
}