import AIFactory from './AIFactory'
import CompilerConfig from './CompilerConfig'
import {
  IfWithoutEndIfException,
  ElseWithoutIfException,
  EndIfWithoutIfException,
  DuplicateAnchorException,
  JumpToUnknownAnchorException,
  OpenStatementException
} from './CompilerException'
import InvalidStatement from './statements/InvalidStatement'

export default class Compiler {
  constructor(code, config = CompilerConfig.getDefault(), deleteEmptyStatements = true) {
    this.code = code
    this.config = config
    this.deleteEmptyStatements = deleteEmptyStatements
    this.statements = []
    this.exceptions = {
      fatal: [],
      undefinedLiterals: []
    }
    this.context = {
      undefinedLiterals: []
    }
  }

  compile() {
    this.compileStatements()
    this.exceptions.undefinedLiterals = this.context.undefinedLiterals
    this.compileStatementLinks()

    this.sortExceptions()
    if (this.exceptions.fatal.length > 0 || this.exceptions.undefinedLiterals.length > 0) {
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
        const primaryStatements = this.config.getPrimaryStatements()
        for (let statementClass of primaryStatements) {
          if (statementClass.matchLine(lines[i])) {
            let currentIndex = primaryStatements.indexOf(statementClass)
            if (!this.config.getAllowedPrimaryStatements().some(st => st === statementClass) &&
              primaryStatements.some((st, index) => index > currentIndex && st.matchLine(lines[i]))) {
              continue
            }
            currentStatement = new statementClass(i, 0)
            break
          }
        }
      }

      if (currentStatement === null) {
        currentStatement = new InvalidStatement(i, 0)
      }

      currentStatement.pushLine(line)
      if (currentStatement.isCodeComplete()) {
        try {
          currentStatement.compile(this.config, this.context)
        } catch (exception) {
          // console.log("### Compiler error:", exception)
          this.exceptions.fatal.push(exception)
        }

        if (!this.deleteEmptyStatements || currentStatement.type !== 'EmptyStatement') {
          this.statements.push(currentStatement)
        }
        currentStatement = null
      }
    }

    if (currentStatement !== null) {
      this.exceptions.fatal.push(new OpenStatementException(`this statement must be closed`, currentStatement, {
        template: 'exception_open_statement_template',
        values: {
          keyword: {
            template: `type_${currentStatement.keyword}`
          }
        }
      }))
    }
  }

  compileStatementLinks() {
    try {
      this.compileIfLinks()
    } catch (exception) {
      this.exceptions.fatal.push(exception)
    }

    try {
      this.checkAnchorsUniqueness()
    } catch (exception) {
      this.exceptions.fatal.push(exception)
    }

    try {
      this.compileJumpLinks()
    } catch (exception) {
      this.exceptions.fatal.push(exception)
    }
  }

  compileIfLinks() {
    let ifStack = []

    for (let i = 0; i < this.statements.length; i++) {
      let statement = this.statements[i]
      let type = statement.type

      if (type === 'ElseStatement') {
        if (ifStack.length === 0) {
          throw new ElseWithoutIfException('else without if before', statement, {
            template: 'exception_else_no_if_template',
            values: {
              elseKeyword: {
                template: 'type_else'
              },
              ifKeyword: {
                template: 'type_if'
              }
            }
          })
        }

        let ifStatement = ifStack[ifStack.length - 1]
        if (ifStatement.elseStatement) {
          throw new ElseWithoutIfException('else without if before', statement, {
            template: 'exception_else_no_if_template',
            values: {
              elseKeyword: {
                template: 'type_else'
              },
              ifKeyword: {
                template: 'type_if'
              }
            }
          })
        }

        ifStatement.setElseStatement(statement)
      } else if (type === 'EndIfStatement') {
        if (ifStack.length === 0) {
          throw new EndIfWithoutIfException('endif without if before', statement, {
            template: 'exception_endif_no_if_template',
            values: {
              endifKeyword: {
                template: 'type_endif'
              },
              ifKeyword: {
                template: 'type_if'
              }
            }
          })
        }

        let ifStatement = ifStack.pop()
        ifStatement.setEndIfStatement(statement)
      } else if (type === 'IfStatement') {
        ifStack.push(statement)
      }
    }

    if (ifStack.length > 0) {
      throw new IfWithoutEndIfException('if without endif to close it', ifStack[ifStack.length - 1], {
        template: 'exception_if_no_endif_template',
        values: {
          endifKeyword: {
            template: 'type_endif'
          },
          ifKeyword: {
            template: 'type_if'
          }
        }
      })
    }
  }

  checkAnchorsUniqueness() {
    let anchorNameSet = []
    this.statements.forEach(statement => {
      if (statement.type === 'AnchorStatement') {
        let anchorStatement = statement

        if (anchorNameSet.some(name => anchorStatement.name === name)) {
          throw new DuplicateAnchorException(`duplicate anchor '${anchorStatement.name}'`, anchorStatement, {
            template: 'exception_duplicate_anchor_template',
            values: {
              anchorName: anchorStatement.name
            }
          })
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
          throw new JumpToUnknownAnchorException(`jump to unknown anchor '${jumpStatement.anchor}'`, jumpStatement, {
            template: 'exception_jump_to_unknown_anchor_template',
            values: {
              anchorName: jumpStatement.anchor ? jumpStatement.anchor : '',
              jumpKeyword: {
                template: 'type_jump'
              }
            }
          })
        }

        jumpStatement.setAnchorStatement(anchorStatement)
      }
    })
  }

  sortExceptions() {
    if (this.exceptions.fatal.length > 0) {
      this.exceptions.fatal.sort((a, b) => {
        if (a.statement.line === b.statement.line) {
          return a.statement.column - b.statement.column
        }
        return a.statement.line - b.statement.line
      })
    }
    if (this.exceptions.undefinedLiterals > 0) {
      this.exceptions.undefinedLiterals.sort((a, b) => {
        if (a.line === b.line) {
          return a.column - b.column
        }
        return a.line - b.line
      })
    }
  }

  computeCodeLength() {
    let codeLength = 0
    for (let statement of this.statements) {
      if (!(statement.type === 'AnchorStatement') && !(statement.type === 'EndIfStatement')) {
        codeLength++
      }
    }
    return codeLength
  }

}