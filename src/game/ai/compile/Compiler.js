import AIFactory from './AIFactory'
import CompilerConfig from './CompilerConfig'
import {
  IfWithoutEndIfException,
  ElseWithoutIfException,
  EndIfWithoutIfException,
  DuplicateAnchorException,
  JumpToUnknownAnchorException
} from './CompilerException'
import InvalidStatement from './statements/InvalidStatement'

export default class Compiler {
  constructor(code, config = CompilerConfig.getDefaultConfig(), deleteEmptyStatements = true) {
    this.code = code
    this.config = config
    this.deleteEmptyStatements = deleteEmptyStatements
    this.statements = []
    this.exception = null
  }

  compile() {
    console.log("COMPILE CODE: \n", this.code)
    console.log("With config: \n", this.config)
    try {
      this.compileStatements()
      this.compileStatementLinks()
    } catch (exception) {
      console.error(exception)
      this.exception = exception
      return null
    }

    return new AIFactory(this.statements, this.config)
  }

  compileStatements() {
    let lines = this.code.split(/\r?\n/)
    let currentStatement = null

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      if (!currentStatement) {
        for (let statementClass of this.config.getPrimaryStatements()) {
          if (statementClass.matchLine(lines[i])) {
            currentStatement = new statementClass(i)
            break
          }
        }
      }

      if (currentStatement === null) {
        currentStatement = new InvalidStatement(i, 0)
      }

      currentStatement.pushLine(line)
      if (currentStatement.isCodeComplete()) {
        currentStatement.compile(this.config)
        if (!this.deleteEmptyStatements || currentStatement.type !== 'EmptyStatement') {
          // console.log(currentStatement)
          this.statements.push(currentStatement)
        }
        currentStatement = null
      }
    }
  }

  compileStatementLinks() {
    this.compileIfLinks()
    this.checkAnchorsUniqueness()
    this.compileJumpLinks()
  }

  compileIfLinks() {
    let ifStack = []
    let elseFound = false

    for (let i = 0; i < this.statements.length; i++) {
      let statement = this.statements[i]
      let type = statement.type

      if (type === 'ElseStatement') {
        if (ifStack.length === 0 || elseFound) {
          throw new ElseWithoutIfException('else without if before', statement)
        }

        let ifStatement = ifStack[ifStack.length - 1]
        ifStatement.setElseStatement(statement)
        elseFound = true
      } else if (type === 'EndIfStatement') {
        if (ifStack.length === 0) {
          throw new EndIfWithoutIfException('endif without if before', statement)
        }

        let ifStatement = ifStack.pop()
        ifStatement.setEndIfStatement(statement)
        elseFound = false
      } else if (type === 'IfStatement') {
        ifStack.push(statement)
      }
    }

    if (ifStack.length > 0) {
      throw new IfWithoutEndIfException('if without endif to close it', ifStack[ifStack.length - 1])
    }
  }

  checkAnchorsUniqueness() {
    let anchorNameSet = []
    this.statements.forEach(statement => {
      if (statement.type === 'AnchorStatement') {
        let anchorStatement = statement

        if (anchorNameSet.some(name => anchorStatement.name === name)) {
          throw new DuplicateAnchorException(`duplicate anchor '${anchorStatement.name}'`, anchorStatement)
        }
        anchorNameSet.push(anchorStatement.name)
      }
    })
  }

  compileJumpLinks() {
    this.statements.forEach(statement => {
      if (statement.type === 'JumpStatement') {
        let jumpStatement = statement
        let anchorStatement = this.statements.find(s => s.type === 'AnchorStatement' && s.name === jumpStatement.anchor)
        if (!anchorStatement) {
          throw new JumpToUnknownAnchorException(`jump to unknown anchor '${jumpStatement.anchor}'`, jumpStatement)
        }

        jumpStatement.setAnchorStatement(anchorStatement)
      }
    })
  }

}