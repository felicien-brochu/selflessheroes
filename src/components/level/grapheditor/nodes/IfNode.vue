<template>
<li class="if-node">
  <div class="group-line" />
  <div class="if-content">
    <ul class="condition-list"
      ref="conditionList">
      <condition-node v-for="(condition, index) in conditions"
        ref="conditionNodes"
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
        @add-condition="handleAddCondition"
        @change="handleConditionChange"
        @start-edit="handleStartEdit" />
    </ul>
    <ul class="node-container"
      ref="nodeContainer">
    </ul>

    <div v-show="elseDeployed"
      class="else-content">
      <div class="node branching-node else-node"
        ref="elseNode">{{
					$text('graph_node_else')
				}}</div>
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
import {
  lineMargin,
  lineHeight
}
from './NodeBuilder'
import NodeBuilder from './NodeBuilder'
import ConditionNode from './ConditionNode'
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import {
  boolOperators
}
from '../../../../world/ai/compile/statements/BooleanExpression'
import {
  compOperators
}
from '../../../../world/ai/compile/statements/SimpleBooleanExpression'
import SimpleBooleanExpression from '../../../../world/ai/compile/statements/SimpleBooleanExpression'

export default {
  extends: Node,
  components: {
    ConditionNode
  },

  props: {
    'statements': {
      type: Array,
      default: () => []
    },
    'compilerConfig': {
      type: Object
    },
    'insertedStatement': Object,
    'inserted': {
      type: Boolean,
      default: false
    }
  },

  data: function() {
    return {
      draggedOver: false,
      autoPopSelectDone: false
    }
  },

  computed: {
    elseDeployed: function() {
      return this.statement.elseStatement || this.draggedOver
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
    autoPopSelect: function() {
      let types = this.compilerConfig.leftComparisonExpressions
      return types.length === 1 && types[0] === DirectionLiteral
    }
  },

  watch: {
    statements: function(statements) {
      this.clearNodeContainers()
      this.populateNodeContainers()
    }
  },

  mounted() {
    this.dragOverIndex = -1
    this.dragTransitionStart = -1
    this.dragOverMarked = false
    this.dragPlaceholderIndex = -1
    this.nodes = [
      []
    ]

    this.populateNodeContainers()

    if (this.autoPopSelect && this.inserted && !this.autoPopSelectDone) {
      this.autoPopSelectDone = true
      this.$refs.conditionNodes[0].startEditLeftExpression()
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

    clearNodeContainers() {
      this.clearNodeContainer(this.$refs.nodeContainer)
      this.clearNodeContainer(this.$refs.elseNodeContainer)
    },

    clearContainer(container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },

    populateNodeContainers() {
      let ifStatementsEnd = this.statement.elseStatement ?
        this.statements.indexOf(this.statement.elseStatement) :
        this.statements.indexOf(this.statement.endIfStatement)

      let ifStatements = this.statements.slice(0, ifStatementsEnd)
      this.populateNodeContainer(this.$refs.nodeContainer, ifStatements, 0)

      if (this.statement.elseStatement) {
        let elseStatements = this.statements.slice(ifStatementsEnd + 1, this.statements.indexOf(this.statement.endIfStatement))
        this.populateNodeContainer(this.$refs.elseNodeContainer, elseStatements, 1)
      }
    },

    populateNodeContainer(container, statements, index) {
      let nodeBuilder = new NodeBuilder(statements)
      let nodes = nodeBuilder.build(this.compilerConfig, this.insertedStatement)
      this.nodes[index] = nodes
      for (let node of nodes) {
        container.appendChild(node.$el)
        node.$parent = this
        node.$on('drag-start', this.handleOwnNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
        node.$on('change', this.handleNodeChange)
        node.$on('start-edit', this.handleStartEdit)
      }
    },

    getDragNodes() {
      let nodes = []
      // Count empty space for empty if
      if (this.nodes[0].length === 0) {
        nodes.push(null)
      }
      else {
        for (let node of this.nodes[0]) {
          nodes.push(node)
        }
      }

      if (this.elseDeployed) {
        nodes.push(null)

        if (this.nodes.length >= 2 && this.nodes[1].length > 0) {
          for (let node of this.nodes[1]) {
            nodes.push(node)
          }
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
      if (position.node) {
        if (position.top) {
          position.node.$el.style.marginTop = `${placeholderHeight + lineMargin}px`
        }
        else {
          position.node.$el.style.marginBottom = `${placeholderHeight + lineMargin}px`
        }
      }
      this.dragPlaceholderIndex = index
    },

    hideDragPlaceholder() {
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

      if (index < this.nodes[0].length) {
        if (this.nodes[0].length > 0) {
          node = this.nodes[0][index]
        }
      }
      else if (index === this.nodes[0].length) {
        if (this.nodes[0].length > 0) {
          node = this.nodes[0][this.nodes[0].length - 1]
          top = false
        }
      }
      else {
        if (this.nodes.length >= 2) {
          let index2 = index - this.nodes[0].length - 1
          if (this.nodes[0].length === 0 && index2 > 0) {
            index2--
          }

          if (index2 < this.nodes[1].length) {
            node = this.nodes[1][index2]
          }
        }
      }

      return {
        node: node,
        top: top
      }
    },

    handleOwnNodeDragStart(e) {
      loop: for (let subNodes of this.nodes) {
        for (let i = 0; i < subNodes.length; i++) {
          if (subNodes[i] === e.node) {
            subNodes.splice(i, 1)
            break loop
          }
        }
      }

      this.handleNodeDragStart(e)
    },

    handleNodeDragStart(e) {
      this.draggedOver = true
      this.$emit('node-drag-start', e)
    },

    getDraggableElement() {
      return this.$refs.conditionList
    },

    handleConditionChange() {
      this.$emit('change', this)
    },

    handleConditionOperatorChange(expression, operator) {
      let index = this.statement.condition.expressions.indexOf(expression)
      if (index >= 0) {
        this.$set(this.statement.condition.operators, index, operator)
        this.$emit('change', this)
      }
    },

    handleDeleteCondition(expression) {
      let index = this.statement.condition.expressions.indexOf(expression)
      if (index >= 0) {
        this.statement.condition.operators.splice(index - 1, 1)
        this.statement.condition.expressions.splice(index, 1)
        this.$emit('change', this)
      }
    },

    handleAddCondition(operator) {
      this.statement.condition.operators.push(operator)
      let expression = new SimpleBooleanExpression(this.statement.condition)
      expression.operator = compOperators[0]
      this.statement.condition.expressions.push(expression)
      this.$emit('change', this)
    },

    handleStartEdit() {
      this.$emit('start-edit')
    }
  }
}
</script>

<style lang="scss">
@import '../../mixins';

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
            padding-top: $node-line-height;
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
            margin-bottom: $node-line-height;
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
        margin-bottom: $node-line-height;
    }
}
</style>
