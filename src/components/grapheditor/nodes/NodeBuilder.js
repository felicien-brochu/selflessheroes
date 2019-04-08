import Vue from 'vue'

import AnchorNode from './AnchorNode'
import AssignNode from './AssignNode'
import IfNode from './IfNode'
import JumpNode from './JumpNode'
import ActionNode from './ActionNode'

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

    console.log(statement, nodeClass)
    let node = new nodeClass({
      propsData: {
        statement: statement
      }
    })
    node.$mount()

    return node
  }
}