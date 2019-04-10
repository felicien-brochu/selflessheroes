<template>
<div class="graph-editor">

  <drag-and-drop-layer :startDragEvent="startDragEvent"
    @drop="handleDrop"
    @drag-over="handleDragOver" />
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
      @drop-node="handleDropNode">

      <jump-link-layer ref="jumpLinkLayer" />

    </graph-code>
  </div>
</div>
</template>

<script>
import DragAndDropLayer from './DragAndDropLayer'
import Palette from './Palette'
import GraphCode from './GraphCode'
import JumpLinkLayer from './JumpLinkLayer'
import NodeBuilder from './nodes/NodeBuilder'
import Compiler from '../../world/ai/compile/Compiler'

export default {
  components: {
    DragAndDropLayer,
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
    this.afterTransitionTimeout = -1
    this.transitionTimerID = -1
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
      this.dragEvent = e
      this.applyDragOver()
    },

    applyDragOver(animationOnly = false) {
      if (!animationOnly) {
        this.$refs.graphCode.handleDragOver(this.dragEvent)
      }
      this.$refs.jumpLinkLayer.handleDragOver(this.dragEvent)
    },

    programDragOverRecall() {
      let afterCallback = function() {
        this.applyDragOver()
      }
      this.afterTransitionTimeout = setTimeout(afterCallback.bind(this), 80)

      if (this.transitionTimerID < 0) {
        let transitionCallback = function() {
          this.applyDragOver(true)
        }
        let afterAnimationCallback = function() {
          if (this.transitionTimerID >= 0) {
            clearInterval(this.transitionTimerID)
            this.transitionTimerID = -1
          }
        }
        this.transitionTimerID = setInterval(transitionCallback.bind(this), 10)
        setTimeout(afterAnimationCallback.bind(this), 120)
      }
    },

    handleDrop(e) {
      if (this.afterTransitionTimeout >= 0) {
        clearTimeout(this.afterTransitionTimeout)
        this.afterTransitionTimeout = -1
      }
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

    .jump-link-layer {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 7;
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
