<template>
<div class="graph-editor">

  <drag-and-drop-layer :startDragEvent="startDragEvent"
    @drop="handleDrop"
    @drag-over="handleDragOver" />

  <popup-layer id="popup-layer"
    :compilerConfig="compilerConfig" />

  <div class="editor-container">

    <transition name="slide"
      :duration="{ enter: 500, leave: 300 }"
      appear>

      <palette ref="palette"
        v-show="!hidePalette"
        :compilerConfig="compilerConfig"
        :chosenStatement="chosenPaletteStatement"
        @drag-start="handlePaletteDragStart" />

    </transition>

    <graph-code ref="graphCode"
      id="graph-code"
      :statements="statements"
      :compilerConfig="compilerConfig"
      :insertedStatement="insertedStatement"
      @node-drag-start="handleNodeDragStart"
      @drop-node="handleDropNode"
      @node-change="handleNodeChange"
      @start-edit="$emit('start-edit')"
      @select-follow-hero="$emit('select-follow-hero', $event)">

      <transition :duration="{enter: 1000, leave: 0}"
        appear
        @enter="handleJumpLinkTransitionStart"
        @after-enter="handleJumpLinkTransitionEnd"
        @enter-cancelled="handleJumpLinkTransitionEnd"
        name="jump-link">
        <jump-link-layer ref="jumpLinkLayer"
          :focusedStatementIndex="focusedStatementIndex" />
      </transition>

      <line-numbers :statements="statements"
        :playing="playing"
        :debugContext="debugContext"
        :followHeroIndex="followHeroIndex"
        @select-follow-hero="$emit('select-follow-hero', $event)"
        @follow-hero-cursor-line-change="handleFollowHeroCursorLineChange" />

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
import LineNumbers from './LineNumbers'
import NodeBuilder from './nodes/NodeBuilder'
import Compiler from '../../../world/ai/compile/Compiler'
import Decompiler from '../../../world/ai/compile/Decompiler'
import Linter from '../../../world/ai/compile/Linter'

export default {
  components: {
    DragAndDropLayer,
    PopupLayer,
    Palette,
    GraphCode,
    JumpLinkLayer,
    LineNumbers
  },

  props: {
    'masterCode': {
      type: String,
      default: ''
    },
    'codeSource': {
      type: String
    },
    'compilerConfig': {
      type: Object,
      default: null
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'playing': {
      type: Boolean
    },
    'hidePalette': {
      type: Boolean,
      default: false
    },
    'debugContext': {
      type: Object
    },
    'followHeroIndex': {
      type: Number
    }
  },

  data: function() {
    return {
      statements: null,
      startDragEvent: null,
      chosenPaletteStatement: null,
      code: this.masterCode,
      focusedStatementIndex: -1,
      insertedStatement: null
    }
  },

  mounted: function() {
    this.dragEvent = null
    this.dragOverChangeAnimationID = -1

    if (this.compilerConfig) {
      this.compileCode()
    }
  },

  watch: {
    compilerConfig: function() {
      if (this.compilerConfig) {
        this.compileCode()
      }
    },
    masterCode: function() {
      if (this.compilerConfig && this.codeSource !== 'graph' && this.codeSource !== 'graph-linter') {
        this.code = this.masterCode
        this.compileCode()
      }
    }
  },

  updated() {
    this.$refs.jumpLinkLayer.updateLinkPaths()
  },

  methods: {
    compileCode() {
      console.debug("####COMPILE code", this.code)
      let compiler = new Compiler(this.code, this.compilerConfig)
      compiler.compile()
      let statements = compiler.statements
      let hasCorrection = Linter.correctForGraph(statements, compiler.exceptions, this.compilerConfig)
      this.statements = statements
      if (hasCorrection) {
        this.decompile(true)
      }
    },

    handlePaletteDragStart(e) {
      this.$emit('start-edit')

      this.insertedStatement = null
      this.focusedStatementIndex = -1
      this.startDragEvent = {
        event: e.event,
        node: NodeBuilder.buildNewNode(e.statement.clazz, this.compilerConfig),
        isNew: true
      }
      this.chosenPaletteStatement = e.statement
    },

    handleNodeDragStart(e) {
      this.$emit('start-edit')

      this.insertedStatement = null
      this.focusedStatementIndex = this.statements.indexOf(e.node.statement)
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
      let focusedStatement = null
      if (this.startDragEvent) {
        let statements = this.statements.slice(0)
        if (dropHandler) {
          let insertIndex = NodeBuilder.insertStatement(statements, dropHandler, this.startDragEvent.node.statement, this.startDragEvent.isNew)
          focusedStatement = statements[insertIndex]
          if (this.startDragEvent.isNew) {
            this.insertedStatement = focusedStatement
          }
        }
        else if (!this.startDragEvent.isNew) {
          NodeBuilder.removeStatement(statements, this.startDragEvent.node.statement)
        }
        this.statements = statements
      }
      this.focusedStatementIndex = this.statements.indexOf(focusedStatement)

      if (this.startDragEvent) {
        let statement = this.startDragEvent.node.statement
        this.$nextTick(function() {
          this.$refs.graphCode.handleStatementDropped(statement)
        })
        this.startDragEvent = null
      }

      this.chosenPaletteStatement = null

      this.decompile()
    },

    handleNodeChange(e) {
      this.$nextTick(function() {
        this.$refs.jumpLinkLayer.updateLinkPaths()
      })

      this.decompile()
    },

    decompile(correction = false) {
      let decompiler = new Decompiler(this.statements, this.compilerConfig)
      decompiler.decompile()
      console.debug("###DECOMPILE", decompiler.exception, decompiler.executable, decompiler.code)
      if (decompiler.exception) {
        throw decompiler.exception
      }

      this.code = decompiler.code
      this.$emit('code-change', decompiler.code, correction)
    },

    handleFollowHeroCursorLineChange(line) {
      this.$refs.graphCode.handleFollowHeroCursorLineChange(line)
    },

    handleJumpLinkTransitionStart() {
      this.transitionTimer = setInterval(() => {
        if (this.$refs.jumpLinkLayer) {
          this.$refs.jumpLinkLayer.updateLinkPaths()
        }
      }, 10)
    },

    handleJumpLinkTransitionEnd() {
      if (this.transitionTimer !== undefined && this.transitionTimer >= 0) {
        clearInterval(this.transitionTimer)
      }
      if (this.$refs.jumpLinkLayer) {
        this.$refs.jumpLinkLayer.updateLinkPaths()
      }
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

    &.switch-enter-active {
        .palette {
            transition: transform 0.5s ease;
        }
    }

    &.switch-leave-active {
        .palette {
            transition: transform 0.2s ease;
        }
    }

    &.switch-enter,
    &.switch-leave-to {
        .palette {
            transform: translate(100%);
        }
    }

    .editor-container {
        z-index: 5;
        position: relative;
        height: 100%;

        .palette {
            z-index: -1;
            position: absolute;
            right: 100%;
            top: 0;
            margin: 60px 0 0;
        }

        .graph-scroll {
            z-index: 10;
        }
    }
}
</style>
