<template>
<div class="graph-scroll">
  <div class="graph-code">
    <line-numbers :numbers="lineNumbers" />
    <ul class="node-container"
      ref="nodeContainer">
    </ul>
  </div>
</div>
</template>

<script>
import Compiler from '../../world/ai/compile/Compiler'
import NodeBuilder from './nodes/NodeBuilder'
import LineNumbers from './LineNumbers'
import {
  getLineNumbersFromNodeGraph
}
from './utils'

export default {
  components: {
    LineNumbers
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'compilerConfig': {
      type: Object,
      default: null
    },
    'worldReady': {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      statements: [],
      lineNumbers: [],
      nodes: []
    }
  },
  watch: {
    worldReady: function(worldReady) {
      this.compileCode()
    },
    code: function(code, oldCode) {
      this.compileCode()
    },
    statements: function(statements) {
      let nodeBuilder = new NodeBuilder(statements)
      let nodes = nodeBuilder.build(this.compilerConfig)
      this.clearNodeContainer()
      this.populateNodeContainer(nodes)
    },
    nodes: function(nodes) {
      this.lineNumbers = getLineNumbersFromNodeGraph(nodes)
    }
  },
  methods: {
    compileCode() {
      console.log("####COMPILE code", this.code)
      let compiler = new Compiler(this.code, this.compilerConfig)
      compiler.compile()
      this.statements = compiler.statements
    },
    clearNodeContainer() {
      let container = this.$refs.nodeContainer
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    },
    populateNodeContainer(nodes) {
      this.nodes = nodes
      let container = this.$refs.nodeContainer
      for (let node of nodes) {
        container.appendChild(node.$el)
        node.$on('drag-start', this.handleNodeDragStart)
        node.$on('node-drag-start', this.handleNodeDragStart)
      }
    },
    handleNodeDragStart(e) {
      console.log("#######handleNodeDragStart", e)
      this.$emit('node-drag-start', e)
    }
  }
}
</script>

<style lang="scss">
@import 'constants';
.node-container {
    @extend %node-list;
    padding-left: 15px;
}

.graph-scroll {
    overflow: auto;
    height: 100%;
    width: 100%;
    position: relative;
    .graph-code {
        display: flex;
        position: absolute;

        & > .node-container {
            padding-top: 10px;
        }

        .code-lines {
            height: auto;
        }
    }
}
</style>
