import Vue from 'vue'

import AnchorNode from './AnchorNode'
import AssignNode from './AssignNode'
import IfNode from './IfNode'
import JumpNode from './JumpNode'
import ActionNode from './ActionNode'

import Linter from '../../../world/ai/compile/Linter'
import AnchorStatement from '../../../world/ai/compile/statements/AnchorStatement'
import AssignStatement from '../../../world/ai/compile/statements/AssignStatement'
import ElseStatement from '../../../world/ai/compile/statements/ElseStatement'
import EndIfStatement from '../../../world/ai/compile/statements/EndIfStatement'
import IfStatement from '../../../world/ai/compile/statements/IfStatement'
import JumpStatement from '../../../world/ai/compile/statements/JumpStatement'
import VariableIdentifier from '../../../world/ai/compile/statements/VariableIdentifier'
import ActionFunction from '../../../world/ai/compile/statements/functions/ActionFunction'
import ValueFunction from '../../../world/ai/compile/statements/functions/ValueFunction'

export default class NodeBuilder {
  constructor(statements) {
    this.statements = statements
    this.nodes = []
  }

  build(compilerConfig) {
    let containerStatements
    let containerStack = []
    let containerClass = null
    let subContainerIndex = 0

    for (let statement of this.statements) {
      let nodeClass = null
      let isContainerStart = false

      if (containerStack.length === 0) {
        if (statement instanceof IfStatement) {
          nodeClass = Vue.extend(IfNode)
          isContainerStart = true
        } else
        if (statement instanceof AnchorStatement) {
          nodeClass = Vue.extend(AnchorNode)
        } else
        if (statement instanceof AssignStatement) {
          nodeClass = Vue.extend(AssignNode)
        } else
        if (statement instanceof JumpStatement) {
          nodeClass = Vue.extend(JumpNode)
        } else
        if (statement instanceof ActionFunction) {
          nodeClass = Vue.extend(ActionNode)
        }

        if (!!nodeClass) {
          if (isContainerStart) {
            containerStatements = [
              []
            ]
            subContainerIndex = 0
            containerClass = nodeClass
            containerStack.push(statement)
          } else {
            let node = new nodeClass({
              propsData: {
                statement: statement,
                compilerConfig: compilerConfig
              }
            })
            node.$mount()
            this.nodes.push(node)
          }
        }
      } else {
        let isContainerEnd = false
        let isContainerDivider = false

        if (statement instanceof ElseStatement) {
          isContainerDivider = true
        } else
        if (statement instanceof EndIfStatement) {
          isContainerEnd = true
        } else
        if (statement instanceof IfStatement) {
          isContainerStart = true
          nodeClass = Vue.extend(IfNode)
        }

        if (containerStack.length === 1 && isContainerDivider) {
          subContainerIndex++
          containerStatements.push([])
        }

        let containerStatement = null
        if (isContainerEnd) {
          containerStatement = containerStack.pop()
        }

        if (containerStack.length > 0) {
          containerStatements[subContainerIndex].push(statement)
        } else {
          let container = new(Vue.extend(containerClass))({
            propsData: {
              statement: containerStatement,
              statements: containerStatements,
              compilerConfig: compilerConfig
            }
          })
          container.$mount()
          this.nodes.push(container)
        }

        if (isContainerStart) {
          containerStack.push(statement)
        }
      }

    }

    return this.nodes
  }

  static buildNewNode(statementClass, compilerConfig) {
    let statement = new statementClass(null, -1, -1)
    let nodeClass = null
    if (statement instanceof IfStatement) {
      nodeClass = Vue.extend(IfNode)
    } else
    if (statement instanceof ValueFunction) {
      let assignStatement = new AssignStatement(null, -1, -1)
      assignStatement.value = statement
      assignStatement.value.parent = assignStatement
      let variable = new VariableIdentifier(assignStatement, -1, -1)
      variable.name = compilerConfig.getAllowedVariableIdentifiers()[0]
      assignStatement.variable = variable
      statement = assignStatement
      nodeClass = Vue.extend(AssignNode)
    } else
    if (statement instanceof JumpStatement) {
      nodeClass = Vue.extend(JumpNode)
    } else
    if (statement instanceof ActionFunction) {
      nodeClass = Vue.extend(ActionNode)
    }

    let node = new nodeClass({
      propsData: {
        statement: statement
      }
    })
    node.$mount()

    return node
  }

  static insertStatement(statements, dragHandler, insertStatement, isNew) {
    statements = statements.slice(0)
    let {
      insertIndex,
      node
    } = dragHandler

    let handlerIndex = 0
    if (node !== this) {
      handlerIndex = statements.indexOf(node.statement)
    }

    // find the real insert index

    let index = insertIndex
    let handlerStatement = node.statement
    let handlerStatements
    if (handlerStatement) {
      if (handlerStatement instanceof IfStatement) {
        let endIndex = !!handlerStatement.elseStatement ? statements.indexOf(handlerStatement.elseStatement) : statements.indexOf(handlerStatement.endIfStatement)
        handlerStatements = statements.slice(handlerIndex + 1, statements.indexOf(handlerStatement.endIfStatement))
      }
    } else {
      handlerStatements = statements.slice(0)
    }


    // Remove sub-statements
    for (let i = 0; i < handlerStatements.length; i++) {
      let currentStatement = handlerStatements[i]
      if (currentStatement instanceof IfStatement) {
        handlerStatements.splice(i + 1, handlerStatements.indexOf(currentStatement.endIfStatement) - i)
      }
    }


    if (handlerStatement) {
      if (handlerStatement instanceof IfStatement) {
        if (insertIndex > handlerStatements.length) {
          // Create Else statement
          let elseStatement = new ElseStatement(null)
          elseStatement.endIfStatement = handlerStatement.endIfStatement
          handlerStatement.elseStatement = elseStatement
          statements.splice(statements.indexOf(handlerStatement.endIfStatement), 0, elseStatement)
          index = statements.indexOf(elseStatement) + 1
        } else if (insertIndex === handlerStatements.length) {
          index = statements.indexOf(handlerStatement.endIfStatement)
        } else {
          index = statements.indexOf(handlerStatements[insertIndex])
        }
      }
    } else {
      if (insertIndex >= handlerStatements.length) {
        index = statements.length
      } else {
        index = statements.indexOf(handlerStatements[insertIndex])
      }
    }


    let insertStatements
    if (isNew) {
      if (insertStatement instanceof JumpStatement) {
        // Add matching AnchorNode
        let anchor = new AnchorStatement(null)
        anchor.name = AnchorStatement.getAvailableName(statements)

        insertStatement.anchor = anchor.name
        insertStatement.anchorStatement = anchor

        insertStatements = [anchor, insertStatement]
      } else if (insertStatement instanceof IfStatement) {
        // Add matching endif
        let endIfStatement = new EndIfStatement(null)
        insertStatement.endIfStatement = endIfStatement

        insertStatements = [insertStatement, endIfStatement]
      } else {
        insertStatements = [insertStatement]
      }
    } else {
      let numberOfStatements = 1
      let oldIndex = statements.indexOf(insertStatement)
      if (insertStatement instanceof IfStatement) {
        numberOfStatements = 1 + statements.indexOf(insertStatement.endIfStatement) - statements.indexOf(insertStatement)
      }
      insertStatements = statements.slice(oldIndex, oldIndex + numberOfStatements)
      statements.splice(oldIndex, numberOfStatements)
      if (oldIndex < index) {
        index -= numberOfStatements
      }
    }

    statements.splice(index, 0, ...insertStatements)
    statements = Linter.removeEmptyElse(statements)

    return statements
  }

  static removeStatement(statements, toRemove) {
    statements = statements.slice(0)
    let numberOfStatements = 1
    let index = statements.indexOf(toRemove)
    if (toRemove instanceof IfStatement) {
      numberOfStatements = 1 + statements.indexOf(toRemove.endIfStatement) - statements.indexOf(toRemove)
    } else if (toRemove instanceof JumpStatement) {
      let anchorIndex = statements.indexOf(toRemove.anchorStatement)
      if (anchorIndex < index) {
        index--
      }
      statements.splice(anchorIndex, 1)
    } else if (toRemove instanceof AnchorStatement) {
      let jumpStatements = toRemove.findPointingJumpStatements(statements)
      for (let jumpStatement of jumpStatements) {
        let jumpIndex = statements.indexOf(jumpStatement)
        if (jumpIndex < index) {
          index--
        }
        statements.splice(jumpIndex, 1)
      }
    }
    statements.splice(index, numberOfStatements)

    return statements
  }
}