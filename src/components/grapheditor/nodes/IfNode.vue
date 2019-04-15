<template>
<li class="if-node">
  <div class="group-line" />
  <div class="if-content">
    <ul class="condition-list"
      ref="conditionList">
      <condition-node v-for="(condition, index) in conditions"
        :key="index"
        :expression="condition.expression"
        :operator="condition.operator"
        :isFirst="index === 0"
        :isLast="index === conditions.length - 1"
        :compilerConfig="compilerConfig"
        @mousedown.native="handleDragStart"
        @touchstart.native="handleDragStart"
        @operator-change="handleConditionOperatorChange(condition.expression, $event)"
        @delete="handleDeleteCondition(condition.expression)"
        @add-condition="handleAddCondition" />
    </ul>
    <ul class="node-container"
      ref="nodeContainer">

      <component v-for="node in ifNodeList"
        :is="node.component"
        ref="ifNodes"
        :statement="node.statement"
        :statements="node.statements"
        :compilerConfig="compilerConfig"
        @drag-start="handleOwnNodeDragStart($event, node.statement)"
        @node-drag-start="handleNodeDragStart" />
    </ul>

    <div v-if="elseDeployed"
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

        <component v-for="node in elseNodeList"
          :is="node.component"
          ref="elseNodes"
          :statement="node.statement"
          :statements="node.statements"
          :compilerConfig="compilerConfig"
          @drag-start="handleOwnNodeDragStart($event, node.statement)"
          @node-drag-start="handleNodeDragStart" />
      </ul>
    </div>
  </div>
</li>
</template>

<script>
import Node from './Node'
import NodeBuilder from './NodeBuilder'
import ConditionNode from './ConditionNode'
import {
  boolOperators
}
from '../../../world/ai/compile/statements/BooleanExpression'
import {
  compOperators
}
from '../../../world/ai/compile/statements/SimpleBooleanExpression'
import SimpleBooleanExpression from '../../../world/ai/compile/statements/SimpleBooleanExpression'

export default {
  extends: Node,
  components: {
    ConditionNode
  },
  props: {
    'statements': {
      type: Array,
      default: () => [
        []
      ]
    },
    'compilerConfig': {
      type: Object
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
    this.dragOverMarked = false
    this.dragPlaceholderIndex = -1
    this.ifNodes = []
    this.elseNodes = []
    console.log("###MOUNTED", this.ifNodes, this.elseNodes)
  },
  updated() {
    this.ifNodes = this.$refs.ifNodes ? this.$refs.ifNodes : []
    this.elseNodes = this.$refs.elseNodes ? this.$refs.elseNodes : []
  },
  computed: {
    elseDeployed: function() {
      return this.statements.length >= 2 || this.draggedOver
    },
    conditions: function() {
      return this.statement.condition.expressions.map(
        (expression, i) => {
          return {
            expression: expression,
            operator: i < this.statement.condition.operators.length ? this.statement.condition.operators[i] : null
          }
        })
    },
    ifNodeList: function() {
      console.log("###ifNodeList")
      return NodeBuilder.buildNodeList(this.statements[0])
    },
    elseNodeList: function() {
      return NodeBuilder.buildNodeList(this.statements[1])
    }
  },
  methods: {
    isDraggableElement(element) {
      for (let conditionNode of this.$refs.conditionList.children) {
        if (element === conditionNode) {
          return true
        }
      }
      return false
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


    getDragNodes() {
      let nodes = []
      // Count empty space for empty if
      if (this.ifNodes.length === 0) {
        nodes.push(null)
      }
      else {
        for (let node of this.ifNodes) {
          nodes.push(node)
        }
      }

      if (this.elseDeployed) {
        nodes.push(null)

        for (let node of this.elseNodes) {
          nodes.push(node)
        }

        // Count empty space at the end of else
        if (this.draggedOver) {
          nodes.push(null)
        }
      }

      return nodes
    },

    handleDragOver() {
      let changed = false
      if (!this.draggedOver) {
        this.draggedOver = true
        changed = true
      }
      return changed
    },

    getHeaderLineNumber() {
      return this.statement.condition.expressions.length
    },

    showDragPlaceholderAt(index, placeholderHeight) {
      this.hideDragPlaceholder()
      let position = this.getDragPlaceholderPosition(index)
      console.log("###ifNod show", position)
      if (position.node) {
        if (position.top) {
          position.node.$el.style.marginTop = `${placeholderHeight + 12}px`
        }
        else {
          position.node.$el.style.marginBottom = `${placeholderHeight + 12}px`
        }
      }
      this.dragPlaceholderIndex = index
    },

    hideDragPlaceholder() {
      console.log("###ifNod hide")
      if (this.dragPlaceholderIndex >= 0) {
        let position = this.getDragPlaceholderPosition(this.dragPlaceholderIndex)
        if (position.node) {
          if (position.top) {
            position.node.$el.style.marginTop = null
          }
          else {
            position.node.$el.style.marginBottom = null
          }
        }
        this.dragPlaceholderIndex = -1
      }
    },

    getDragPlaceholderPosition(index) {
      let node = null
      let top = true

      console.log("##length", index, this.ifNodes.length, this.elseNodes.length)
      if (index < this.ifNodes.length) {
        if (this.ifNodes.length > 0) {
          node = this.ifNodes[index]
        }
      }
      else if (index === this.ifNodes.length) {
        if (this.ifNodes.length > 0) {
          node = this.ifNodes[this.ifNodes.length - 1]
          top = false
        }
      }
      else {
        if (this.elseNodes) {
          let index2 = index - this.ifNodes.length - 1
          if (index2 === 1 && this.ifNodes.length === 0) {
            index2--
          }

          if (index2 < this.elseNodes.length) {
            node = this.elseNodes[index2]
          }
        }
      }

      return {
        node: node,
        top: top
      }
    },

    handleOwnNodeDragStart(e, statement) {
      console.log("###handleOwnNodeDragStart ifnode", statement, e)
      this.handleNodeDragStart({
        event: e.event,
        draggedElement: e.node.getDraggableElement(),
        statement: statement
      })
      this.draggedOver = true
    },

    handleNodeDragStart(e) {
      this.$emit('node-drag-start', e)
      this.draggedOver = true
    },

    handleDrop(e) {
      this.hideDragPlaceholder()
      console.log("### if HANDLE drop")
      for (let node of this.ifNodes) {
        console.log("### ifnodes HANDLE drop")
        node.handleDrop(e)
      }
      for (let node of this.elseNodes) {
        console.log("### elsenodes HANDLE drop")
        node.handleDrop(e)
      }
      this.draggedOver = false
    },

    getDraggableElement() {
      return this.$refs.conditionList
    },

    handleConditionOperatorChange(expression, operator) {
      let index = this.statement.condition.expressions.indexOf(expression)
      if (index >= 0) {
        this.$set(this.statement.condition.operators, index, operator)
      }
    },

    handleDeleteCondition(expression) {
      let index = this.statement.condition.expressions.indexOf(expression)
      if (index >= 0) {
        this.statement.condition.operators.splice(index - 1, 1)
        this.statement.condition.expressions.splice(index, 1)
      }
    },

    handleAddCondition(operator) {
      this.statement.condition.operators.push(operator)
      let expression = new SimpleBooleanExpression(this.statement.condition)
      expression.operator = compOperators[0]
      this.statement.condition.expressions.push(expression)
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
    width: 5px;
    background-color: transparentize($branching-color, 0.7);
    left: 5px;
    top: 0;
    bottom: -3px;
}

.if-node {
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
            padding-top: 34px;
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
            margin-bottom: 34px;
            animation: open-node-margin-bottom 0.15s ease;

            & > li:last-child {
                margin-bottom: $line-margin;
            }
        }
    }
}
@keyframes open-node-margin-bottom {
    0% {
        margin-bottom: 0;
    }
    100% {
        margin-bottom: 34px;
    }
}
</style>
