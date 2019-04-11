import IfStatement from '../../world/ai/compile/statements/IfStatement'

export default class DragTree {
  constructor(rootNode, rootNodes, lineHeight) {
    this.rootNode = rootNode
    this.rootNodes = rootNodes.slice(0)
    this.lineHeight = lineHeight

    this.rootNodes.push(null)
    this.tree = buildTree(this.rootNodes, null)

    this.dragOverNode = {
      parent: null,
      index: -1
    }
  }

  handleDragOver(event, bounds, scrollContainer) {
    let y = event.y - bounds.y + scrollContainer.scrollTop
    let line = Math.floor(y / this.lineHeight)
    let overNode = null
    let changed

    do {
      changed = false
      overNode = this.getNodeAtLine(line)
      let bubbleNode = overNode
      while (bubbleNode) {
        if (bubbleNode.node) {
          changed = changed || bubbleNode.node.handleDragOver(changed)
        }
        bubbleNode = bubbleNode.parent
      }
      if (changed) {
        this.tree = buildTree(this.rootNodes, null)
        y = event.y - bounds.y + scrollContainer.scrollTop
        line = Math.floor(y / this.lineHeight)
      }
    } while (changed)

    let parent = this.rootNode
    let parentTree = this.tree
    if (overNode.parent) {
      parent = overNode.parent.node
      parentTree = overNode.parent.tree
    }

    let dragOverNode = {
      parent: parent,
      index: parentTree.indexOf(overNode)
    }

    let dragPositionChanged = false
    if (dragOverNode.parent !== this.dragOverNode.parent ||
      dragOverNode.index !== this.dragOverNode.index) {
      dragPositionChanged = true
      for (let node of this) {
        if (node.node && node.node !== parent) {
          node.node.hideDragPlaceholder()
        }
      }
      this.rootNode.hideDragPlaceholder()
      parent.showDragPlaceholderAt(parentTree.indexOf(overNode), event.height)
    }

    // Fix empty spots for empty if statements with else
    let insertIndex = dragOverNode.index
    let emptySpots = 0
    for (let i = 0; i < dragOverNode.index; i++) {
      if (parentTree[i].node === null) {
        emptySpots++
      }
    }
    if (emptySpots >= 2) {
      insertIndex--
    }
    return {
      dropHandler: {
        node: dragOverNode.parent,
        insertIndex: insertIndex
      },
      dragPositionChanged: dragPositionChanged
    }
  }

  handleDragOut() {
    for (let node of this) {
      if (node.node) {
        node.node.hideDragPlaceholder()
      }
    }
    this.rootNode.hideDragPlaceholder()
  }

  getNodeAtLine(line) {
    let lines = 0

    let node
    for (node of this) {
      lines += node.lines
      if (line < lines) {
        break
      }
    }
    return node
  }

  [Symbol.iterator]() {
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

        if (node.tree.length > 0) {
          this._nodeStack.push(node.tree)
          this._indexStack.push(0)
          this._index++
        }

        return {
          value: node,
          done: false
        }
      },
      _nodeStack: [this.tree],
      _indexStack: [0],
      _index: 0
    }
  }

}

function buildTree(rootNodes, parent) {
  let tree = []
  for (let node of rootNodes) {
    let dragNode = new DragNode(node, parent)
    tree.push(dragNode)

    let subTree = []
    if (node && node.statement instanceof IfStatement) {
      subTree = buildTree(node.getDragNodes(), dragNode)
    }
    dragNode.tree = subTree
  }

  return tree
}

class DragNode {
  constructor(node, parent, tree = []) {
    this.node = node
    this.parent = parent
    this.tree = tree
    this.lines = 1

    if (node) {
      this.lines = node.getHeaderLineNumber()
    }
  }
}