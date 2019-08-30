<template>
<ul class="simple-graph-code" />
</template>

<script>
import NodeBuilder from '../grapheditor/nodes/NodeBuilder'
import Compiler from '../../../world/ai/compile/Compiler'

export default {
  props: {
    compilerConfig: Object,
    code: {
      type: String,
      default: 'if e == hero:\nstep(w)\nendif'
    }
  },
  data: function() {
    let compiler = new Compiler(this.code, this.compilerConfig)
    compiler.compile()
    return {
      statements: compiler.statements
    }
  },

  mounted() {
    this.populateNodeContainer()
  },

  methods: {
    populateNodeContainer() {
      let nodeBuilder = new NodeBuilder(this.statements)
      this.nodes = nodeBuilder.build(this.compilerConfig, this.insertedStatement)

      for (let node of this.nodes) {
        this.$el.appendChild(node.$el)
        node.$parent = this
      }
    }
  }
}
</script>

<style lang="scss">
.simple-graph-code {
    display: flex;
    flex-direction: column;

    .node {
        width: min-content;
        pointer-events: none;
        &.assign-node .function-container .value-select {
            pointer-events: none;
        }

        &:not(:last-child):not(.else-node) {
            margin-bottom: 12px;
        }
    }

    .anchor-node {
        width: 30px;
    }

    .if-node {
        white-space: nowrap;
        .group-line {
            z-index: 0;
        }
    }
}
</style>
