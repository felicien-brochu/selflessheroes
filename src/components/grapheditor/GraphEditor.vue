<template>
<div class="graph-editor">

  <drag-and-drop-layer :startDragEvent="startDragEvent"
    @drop="handleDrop"
    @drag-over="handleDragOver" />
  <popup-layer id="popup-layer"
    :compilerConfig="compilerConfig" />
  <div class="editor-container">
    <palette ref="palette"
      :compilerConfig="compilerConfig"
      :chosenStatement="chosenPaletteStatement"
      @drag-start="handlePaletteDragStart" />
    <graph-code ref="graphCode"
      id="graph-code"
      :code="code"
      :statements="statements"
      :compilerConfig="compilerConfig"
      :worldReady="worldReady"
      @node-drag-start="handleNodeDragStart"
      @drop-node="handleDropNode">

      <jump-link-layer ref="jumpLinkLayer" />

    </graph-code>
  </div>
</div>
</template>

<script>
import DragAndDropLayer from './DragAndDropLayer'
import PopupLayer from './nodes/PopupLayer'
import Palette from './Palette'
import GraphCode from './GraphCode'
import JumpLinkLayer from './JumpLinkLayer'
import NodeBuilder from './nodes/NodeBuilder'
import Compiler from '../../world/ai/compile/Compiler'

export default {
  components: {
    DragAndDropLayer,
    PopupLayer,
    Palette,
    GraphCode,
    JumpLinkLayer
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
    this.dragEvent = null
    this.dragOverChangeAnimationID = -1
  },
  watch: {
    worldReady: function(worldReady) {
      if (worldReady) {
        this.$refs.palette.$el.style.left = "-115px"
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
      this.dragEvent = e
      this.$refs.graphCode.handleDragOver(this.dragEvent)
      this.$refs.jumpLinkLayer.updateLinkPaths()
    },

    startDragOverChangeAnimation() {
      if (this.dragOverChangeAnimationID < 0) {
        let millis = Date.now()
        let transitionCallback = function() {
          if (this.$refs.jumpLinkLayer && Date.now() < millis + 200) {
            this.$refs.jumpLinkLayer.updateLinkPaths()
          }
          else {
            clearInterval(this.dragOverChangeAnimationID)
            this.dragOverChangeAnimationID = -1
          }
        }
        this.dragOverChangeAnimationID = setInterval(transitionCallback.bind(this), 10)
      }
    },

    handleDrop(e) {
      this.$refs.graphCode.handleDrop(e)
    },

    handleDropNode(dropHandler) {
      if (this.startDragEvent) {
        if (dropHandler) {
          NodeBuilder.insertStatement(this.statements, dropHandler, this.startDragEvent.node.statement, this.startDragEvent.isNew)
        }
        else if (!this.startDragEvent.isNew) {
          NodeBuilder.removeStatement(this.statements, this.startDragEvent.node.statement)
        }
      }
      let statement = this.startDragEvent.node.statement
      this.$nextTick(function() {
        this.$refs.graphCode.handleStatementDropped(statement)
      })

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

    .jump-link-layer {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 7;
    }

    #popup-layer {
        left: 0;
        top: 0;
        z-index: 100000000;
    }

    .editor-container {
        z-index: 5;
        position: relative;
        height: 100%;

        .palette {
            z-index: -1;
            position: absolute;
            left: 0;
            top: 0;
            margin: 40px 0 0;

            transition-property: left;
            transition-duration: 0.8s;
        }

        .graph-scroll {
            z-index: 10;
        }
    }
}
</style>
