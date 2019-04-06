import AnchorNode from './nodes/AnchorNode'
import AssignNode from './nodes/AssignNode'
import IfNode from './nodes/IfNode'
import JumpNode from './nodes/JumpNode'
import ActionNode from './nodes/ActionNode'
import Vue from 'vue'

function getLineNumbersFromNodeGraph(nodes) {
  let lineNumbers = []
  let line = 1

  for (let node of nodes) {
    if (node instanceof Vue.extend(AnchorNode)) {
      lineNumbers.push(' ')
    } else if (node.nodes !== undefined) {
      // TODO: Count 'empty' lines of the ifNode condition

      for (let i = 0; i < node.nodes.length; i++) {
        lineNumbers.push(line.toString())
        line++

        let subNumbers = getLineNumbersFromNodeGraph(node.nodes[i])
        let max = 0
        subNumbers.forEach(num => {
          if (max < num) {
            max = parseInt(num)
          }
        })

        subNumbers = subNumbers.map(num => num === ' ' ? ' ' : (parseInt(num) + line - 1).toString())
        lineNumbers = [
          ...lineNumbers,
          ...subNumbers
        ]
        line += max
      }
    } else {
      lineNumbers.push(line.toString())
      line++
    }
  }
  return lineNumbers
}

export {
  getLineNumbersFromNodeGraph
}