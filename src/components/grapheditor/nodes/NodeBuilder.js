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
import BooleanExpression from '../../../world/ai/compile/statements/BooleanExpression'
import SimpleBooleanExpression from '../../../world/ai/compile/statements/SimpleBooleanExpression'
import {
  compOperators
} from '../../../world/ai/compile/statements/SimpleBooleanExpression'
import VariableIdentifier from '../../../world/ai/compile/statements/VariableIdentifier'
import ActionFunction from '../../../world/ai/compile/statements/functions/ActionFunction'
import ValueFunction from '../../../world/ai/compile/statements/functions/ValueFunction'

export default class NodeBuilder {

  static buildNodeList(statements) {
    if (!statements) {
      return []
    }

    let nodes = []
    let containerStatements
    let containerStack = []
    let containerComponent = null
    let subContainerIndex = 0

    for (let statement of statements) {
      let component = null
      let isContainerStart = false

      if (containerStack.length === 0) {
        if (statement instanceof IfStatement) {
          component = IfNode
          isContainerStart = true
        } else
        if (statement instanceof AnchorStatement) {
          component = AnchorNode
        } else
        if (statement instanceof AssignStatement) {
          component = AssignNode
        } else
        if (statement instanceof JumpStatement) {
          component = JumpNode
        } else
        if (statement instanceof ActionFunction) {
          component = ActionNode
        }

        if (!!component) {
          if (isContainerStart) {
            containerStatements = [
              []
            ]
            subContainerIndex = 0
            containerComponent = component
            containerStack.push(statement)
          } else {
            let node = {
              component: component,
              statement: statement
            }
            nodes.push(node)
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
          component = IfNode
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
          let container = {
            component: containerComponent,
            statement: containerStatement,
            statements: containerStatements
          }
          nodes.push(container)
        }

        if (isContainerStart) {
          containerStack.push(statement)
        }
      }

    }

    return nodes
  }

  static buildNewStatements(statementClass, compilerConfig) {
    let statements = []
    let statement = new statementClass(null, -1, -1)

    if (statementClass === IfStatement) {
      let ifStatement = statement
      ifStatement.condition = new BooleanExpression(ifStatement, -1, -1)
      let expression = new SimpleBooleanExpression(ifStatement.condition, -1, -1)
      expression.operator = compOperators[0]
      ifStatement.condition.expressions.push(expression)

      let endIfStatement = new EndIfStatement(null, -1, -1)
      ifStatement.endIfStatement = endIfStatement
      statements.push(ifStatement)
      statements.push(endIfStatement)
    } else
    if (statement instanceof ValueFunction) {
      let assignStatement = new AssignStatement(null, -1, -1)
      assignStatement.value = statement
      assignStatement.value.parent = assignStatement
      let variable = new VariableIdentifier(assignStatement, -1, -1)
      variable.name = compilerConfig.getAllowedVariableIdentifiers()[0]
      assignStatement.variable = variable
      statements.push(assignStatement)
    } else {
      statements.push(statement)
    }

    return statements
  }

  static insertStatements(statements, dragHandler, insertStatements, isNew) {
    let {
      insertIndex,
      node
    } = dragHandler

    // find the real insert index

    let index = insertIndex
    let handlerStatement = node.statement
    let handlerIndex = statements.indexOf(handlerStatement)
    let handlerStatements
    if (handlerStatement) {
      if (handlerStatement instanceof IfStatement) {
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


    let indexInHandler = -1
    if (indexInHandler >= 0 && indexInHandler <= insertIndex) {
      insertIndex++
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

    if (isNew) {
      if (insertStatements[0] instanceof JumpStatement) {
        // Add matching AnchorNode
        let anchor = new AnchorStatement(null)
        anchor.name = AnchorStatement.getAvailableName(statements)

        insertStatements[0].anchor = anchor.name
        insertStatements[0].anchorStatement = anchor

        insertStatements = [anchor, insertStatements[0]]
      }
    }

    statements.splice(index, 0, ...insertStatements)
    Linter.removeEmptyElse(statements)
  }

  static removeStatement(statements, toRemove, removeLinkedJump = true) {
    let numberOfStatements = 1
    let index = statements.indexOf(toRemove)
    if (toRemove instanceof IfStatement) {
      numberOfStatements = 1 + statements.indexOf(toRemove.endIfStatement) - statements.indexOf(toRemove)
    } else if (removeLinkedJump) {
      if (toRemove instanceof JumpStatement) {
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
    }
    statements.splice(index, numberOfStatements)
    Linter.removeEmptyElse(statements)
  }

  static makeNodesIterable(rootNodes) {
    rootNodes[Symbol.iterator] = function() {
      return {
        next: function() {
          let nodes = this._nodeStack[this._index]
          let index = this._indexStack[this._index]

          while (index === nodes.length) {
            if (this._nodeStack.length <= 1) {
              return {
                done: true
              }
            }
            this._nodeStack.pop()
            this._indexStack.pop()
            this._index--
            nodes = this._nodeStack[this._index]
            index = this._indexStack[this._index]
          }

          let node = nodes[index]
          this._indexStack[this._index]++

          if (node.nodes) {
            let subNodes = []
            for (let subs of node.nodes) {
              subNodes = subNodes.concat(subs)
            }
            if (subNodes.length > 0) {
              this._nodeStack.push(subNodes)
              this._indexStack.push(0)
              this._index++
            }
          }

          return {
            value: node,
            done: false
          }
        },
        _nodeStack: [rootNodes],
        _indexStack: [0],
        _index: 0
      }
    }
  }
}