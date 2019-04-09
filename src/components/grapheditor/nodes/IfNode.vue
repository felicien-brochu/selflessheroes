<template>
<li class="if-node">
  <div class="group-line" />
  <div class="if-content">
    <ul class="condition-list"
      ref="conditionList">
      <li class="node branching-node condition-node"
        @mousedown="handleDragStart">
        if
      </li>
    </ul>
    <ul class="node-container"
      ref="nodeContainer">
    </ul>

    <div v-if="statements.length >= 2 || draggedOver"
      class="else-content">
      <div class="node branching-node else-node"
        ref="elseNode">
        else
      </div>
      <ul :class="{
				'node-container': true,
				'dragged-over': draggedOver
				}"
        ref="elseNodeContainer">
      </ul>
    </div>
  </div>
</li>
</template>

<script>
import Node from './Node'
import NodeBuilder from './NodeBuilder'

export default {
  extends: Node,
  props: {
    'statements': {
      type: Array,
      default: () => [
        []
      ]
    }
  },
  data: function() {
    return {
      draggedOver: false
    }
  },
  mounted() {
    this.dragOverIndex = -1
    this.dragTransitionStart = -1
    this.nodes = [
      []
    ]

    for (let i = 0; i < this.statements.length; i++) {
      this.populateNodeContainer(i)
    }
  },
  watch: {
    statements: function(statements) {
      for (let i = 0; i < this.statements.length; i++) {
        this.clearNodeContainer(i)
        this.populateNodeContainer(i)
      }
    }
  },
  methods: {
    getDragNodes() {
      let mapping = node => {
        return {
          node: node,
          el: node.$el,
          draggable: node.getDraggableElement()
        }
      }

      let nodes = this.nodes[0].map(mapping)

      if (!!this.$refs.elseNode) {
        // Insert else node
        nodes.push({
          node: null,
          el: this.$refs.elseNode,
          draggable: this.$refs.elseNode
        })
      }

      if (this.nodes.length > 1) {
        nodes = nodes.concat(this.nodes[1].map(mapping))
      }
      return nodes
    },
    clearNodeContainer(index) {
      let container = this.getNodeContainer(index)
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },

    populateNodeContainer(index) {
      let nodeBuilder = new NodeBuilder(this.statements[index])
      let nodes = nodeBuilder.build(this.compilerConfig)
      this.nodes[index] = nodes
      let container = this.getNodeContainer(index)
      for (let node of nodes) {
        container.appendChild(node.$el)
        node.$on('drag-start', this.handleNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
      }
    },

    getNodeContainer(index) {
      if (index === 0) {
        return this.$refs.nodeContainer
      }
      else if (index === 1) {
        return this.$refs.elseNodeContainer
      }
      return null
    },

    handleDragOver(event) {
      let bounds = this.$el.getBoundingClientRect()
      let conditionBox = this.getDraggableElement().getBoundingClientRect()
      let thisBox = this.$el.getBoundingClientRect()
      if (event.y + event.height >= bounds.top &&
        event.y <= bounds.top + bounds.height &&
        event.y > conditionBox.top + conditionBox.height - 2 &&
        event.y + event.height < thisBox.top + thisBox.height + 20) {
        this.draggedOver = true
        let nodes = this.getDragNodes()
        let handler = null

        let above = -1
        let bellow = -1

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          if (!!node.node && node.node === event.node) {
            continue
          }

          let nodeBox = node.draggable.getBoundingClientRect()
          if (!!node.node) {
            let subHandler = node.node.handleDragOver(event)
            if (!!subHandler && !handler) {
              handler = subHandler
            }
          }
          if (event.y + event.height >= nodeBox.top + 21) {
            bellow = i
          }
          if (event.y <= nodeBox.top + nodeBox.height - 2) {
            if (above < 0) {
              above = i
            }
          }
        }

        let needRecall = false
        if (handler === null) {
          if (Date.now() > this.dragTransitionStart + 100) {
            let afterIndex = above
            if (above === bellow) {
              if (above !== this.dragOverIndex) {
                afterIndex = above
              }
              else if (bellow + 1 !== this.dragOverIndex) {
                afterIndex = bellow + 1
                if (afterIndex < nodes.length &&
                  nodes[afterIndex].node &&
                  nodes[afterIndex].node === event.node) {
                  afterIndex++
                }
              }
            }
            else if (above < 0 && (bellow === nodes.length - 1 || bellow === nodes.length - 2)) {
              afterIndex = nodes.length
            }

            needRecall = afterIndex !== this.dragOverIndex
            this.placeDragOver(afterIndex)
          }

          if (this.dragOverIndex >= 0) {
            handler = {
              node: this,
              insertIndex: this.dragOverIndex,
              needRecall: needRecall
            }
          }
        }
        else {
          this.clearDragOver()
        }
        return handler
      }
      else {
        this.handleDragOut()
        return null
      }
    },

    handleDragOut(e) {
      this.clearDragOver()

      for (let nodes of this.nodes) {
        for (let node of nodes) {
          node.handleDragOut()
        }
      }
    },

    handleDragOutGraph() {
      this.clearDragOver()
      this.draggedOver = false

      for (let nodes of this.nodes) {
        for (let node of nodes) {
          node.handleDragOutGraph()
        }
      }
    },

    placeDragOver(afterIndex) {
      if (afterIndex !== this.dragOverIndex) {
        this.clearDragOver()
        let nodes = this.getDragNodes()
        if (afterIndex < nodes.length) {
          if (this.dragOverIndex > 0 || this.nodes[0].length > 0) {
            nodes[afterIndex].el.style.marginTop = '40px'
          }
        }
        else if (this.dragOverIndex > 0 && this.dragOverIndex > this.nodes[0].length) {
          nodes[nodes.length - 1].el.style.marginBottom = '40px'
        }
        this.dragOverIndex = afterIndex
        this.dragTransitionStart = Date.now()
      }
    },

    clearDragOver() {
      if (this.dragOverIndex >= 0) {
        let nodes = this.getDragNodes()
        if (this.dragOverIndex < nodes.length) {
          nodes[this.dragOverIndex].el.style.marginTop = null
        }
        else {
          nodes[nodes.length - 1].el.style.marginBottom = null
        }
        this.dragOverIndex = -1
        this.dragTransitionStart = Date.now()
      }
    },

    handleNodeDragStart(e) {
      this.$emit('node-drag-start', e)
    },

    getDraggableElement() {
      return this.$refs.conditionList
    },

    handleDrop(e) {
      this.clearDragOver()
      this.draggedOver = false

      for (let nodes of this.nodes) {
        for (let node of nodes) {
          node.handleDrop(e)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.group-line {
    position: absolute;
    z-index: -1;
    height: auto;
    width: 4px;
    background-color: transparentize($branching-color, 0.7);
    left: 3px;
    top: 0;
    bottom: -3px;
}

.if-node {
    @include animate-margin;
    position: relative;
}

.if-content {
    @extend %node-list;

    .condition-list {
        @extend %node-list;
    }

    & > .node-container {
        margin-top: $line-margin;

        &:empty {
            padding-top: 29px;
        }
    }
}

.else-content {
    @extend %node-list;

    margin-top: $line-margin;

    .else-node {
        cursor: initial;
    }

    & > .node-container {
        margin-top: $line-margin;

        &.dragged-over {
            margin-bottom: 29px;

            & > li:last-child {
                margin-bottom: $line-margin;
            }
        }
    }
}
</style>
