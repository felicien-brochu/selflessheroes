import Vue from 'vue'

import AnchorNode from './AnchorNode'
import AssignNode from './AssignNode'
import IfNode from './IfNode'
import JumpNode from './JumpNode'
import ActionNode from './ActionNode'

import Linter from '../../../../world/ai/compile/Linter'
import AnchorStatement from '../../../../world/ai/compile/statements/AnchorStatement'
import AssignStatement from '../../../../world/ai/compile/statements/AssignStatement'
import ElseStatement from '../../../../world/ai/compile/statements/ElseStatement'
import EndIfStatement from '../../../../world/ai/compile/statements/EndIfStatement'
import IfStatement from '../../../../world/ai/compile/statements/IfStatement'
import JumpStatement from '../../../../world/ai/compile/statements/JumpStatement'
import BooleanExpression from '../../../../world/ai/compile/statements/BooleanExpression'
import SimpleBooleanExpression from '../../../../world/ai/compile/statements/SimpleBooleanExpression'
import {
  compOperators
} from '../../../../world/ai/compile/statements/SimpleBooleanExpression'
import VariableIdentifier from '../../../../world/ai/compile/statements/VariableIdentifier'
import ActionFunction from '../../../../world/ai/compile/statements/functions/ActionFunction'
import ValueFunction from '../../../../world/ai/compile/statements/functions/ValueFunction'

export const lineMargin = 12
export const lineHeight = 46

export default class NodeBuilder {
  constructor(statements) {
    this.statements = statements
    this.nodes = []
  }

  build(compilerConfig) {
    let containerStatements
    let containerStack = []
    let containerClass = null

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

        if (statement instanceof EndIfStatement) {
          isContainerEnd = true
        } else
        if (statement instanceof IfStatement) {
          isContainerStart = true
          nodeClass = Vue.extend(IfNode)
        }

        let containerStatement = null
        if (isContainerEnd) {
          containerStatement = containerStack.pop()
        }

        containerStatements.push(statement)

        if (containerStack.length === 0) {
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
    let statement = new statementClass(-1, -1)
    let nodeClass = null
    let props = {}
    if (statement instanceof IfStatement) {
      statement.condition = new BooleanExpression(statement, -1, -1)
      let expression = new SimpleBooleanExpression(statement.condition, -1, -1)
      expression.operator = compOperators[0]
      statement.condition.expressions.push(expression)
      nodeClass = Vue.extend(IfNode)
      props = {
        compilerConfig: compilerConfig
      }
    } else
    if (statement instanceof ValueFunction) {
      let assignStatement = new AssignStatement(-1, -1)
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
        statement: statement,
        ...props
      }
    })
    node.$mount()

    return node
  }

  static insertStatement(statements, dragHandler, insertStatement, isNew) {
    let {
      insertIndex,
      node
    } = dragHandler

    let handlerIndex = statements.indexOf(node.statement)


    // find the real insert index

    let index = insertIndex
    let handlerStatement = node.statement
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


    let indexInHandler = handlerStatements.indexOf(insertStatement)
    if (indexInHandler >= 0 && indexInHandler <= insertIndex) {
      insertIndex++
    }


    if (handlerStatement) {
      if (handlerStatement instanceof IfStatement) {
        if (insertIndex > handlerStatements.length) {
          // Create Else statement
          let elseStatement = new ElseStatement(-1, -1)
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
        let anchor = new AnchorStatement(-1, -1)
        anchor.name = AnchorStatement.getAvailableName(statements)

        insertStatement.anchor = anchor.name
        insertStatement.anchorStatement = anchor

        insertStatements = [anchor, insertStatement]
      } else if (insertStatement instanceof IfStatement) {
        // Add matching endif
        let endIfStatement = new EndIfStatement(-1, -1)
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
    Linter.removeEmptyElse(statements)
  }

  static removeStatement(statements, toRemove) {
    let numberOfStatements = 1
    let index = statements.indexOf(toRemove)
    if (toRemove instanceof IfStatement) {
      numberOfStatements = 1 + statements.indexOf(toRemove.endIfStatement) - statements.indexOf(toRemove)
    }
    statements.splice(index, numberOfStatements)
    Linter.removeOrphanJumps(statements)
    Linter.removeOrphanAnchors(statements)
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