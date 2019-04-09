<template>
<div class="graph-editor">

  <drag-and-drop-layer :startDragEvent="startDragEvent"
    @drop="handleDrop"
    @drag-over="$refs.graphCode.handleDragOver($event)" />
  <div class="editor-container">
    <palette ref="palette"
      :compilerConfig="compilerConfig"
      :chosenStatement="chosenPaletteStatement"
      @drag-start="handlePaletteDragStart" />
    <graph-code ref="graphCode"
      :code="code"
      :statements="statements"
      :compilerConfig="compilerConfig"
      :worldReady="worldReady"
      @node-drag-start="handleNodeDragStart"
      @drop-node="handleDropNode" />
  </div>
</div>
</template>

<script>
import DragAndDropLayer from './DragAndDropLayer'
import Palette from './Palette'
import GraphCode from './GraphCode'
import NodeBuilder from './nodes/NodeBuilder'
import Compiler from '../../world/ai/compile/Compiler'

export default {
  components: {
    DragAndDropLayer,
    Palette,
    GraphCode
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
  model: {
    prop: 'code',
    event: 'change'
  },
  data: function() {
    return {
      statements: [],
      startDragEvent: null,
      chosenPaletteStatement: null
    }
  },
  computed: {
    playing: function() {
      return !this.worldReady || this.worldState.steps > 0
    }
  },
  mounted: function() {

  },
  watch: {
    worldReady: function(worldReady) {
      if (worldReady) {
        this.$refs.palette.$el.style.left = "-100px"
        this.compileCode()
      }
    },
    code: function(code, oldCode) {
      this.compileCode()
    }
  },
  methods: {
    compileCode() {
      console.log("####COMPILE code", this.code)
      let compiler = new Compiler(this.code, this.compilerConfig)
      compiler.compile()
      this.statements = compiler.statements
    },

    handlePaletteDragStart(e) {
      this.startDragEvent = {
        event: e.event,
        node: NodeBuilder.buildNewNode(e.statement.clazz, this.compilerConfig),
        isNew: true
      }
      this.chosenPaletteStatement = e.statement
    },

    handleNodeDragStart(e) {
      this.startDragEvent = {
        ...e,
        isNew: false
      }
    },

    handleDragOver(e) {
      this.$refs.graphCode.handleDragOver(e)
    },

    handleDrop(e) {
      this.$refs.graphCode.handleDrop(e)
    },

    handleDropNode(dropHandler) {
      if (this.startDragEvent) {
        if (dropHandler) {
          this.statements = NodeBuilder.insertStatement(this.statements, dropHandler, this.startDragEvent.node.statement, this.startDragEvent.isNew)
        }
        else {
          this.statements = NodeBuilder.removeStatement(this.statements, this.startDragEvent.node.statement)
        }
      }
      this.startDragEvent = null
      this.chosenPaletteStatement = null
    }
  }
}
</script>

<style lang="scss">
.Pane {
    position: static !important;
}
.graph-editor {
    font-family: Roboto, sans-serif;
    font-size: 16px;
    z-index: 10;
    color: white;
    width: 100%;
    height: 100%;
    overflow: visible;

    .drag-and-drop-layer {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100000000;
    }

    .editor-container {
        z-index: 5;
        position: relative;
        height: 100%;

        .palette {
            z-index: 5;
            position: absolute;
            left: 0;
            top: 0;
            margin: 40px 0 0;

            transition-property: left;
            transition-duration: 0.8s;
        }

        .graph-code {
            position: relative;
            z-index: 10;
            height: min-content;
            background-color: #282c34;
        }
    }
}
</style>
