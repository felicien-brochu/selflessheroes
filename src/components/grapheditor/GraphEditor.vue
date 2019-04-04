<template>
<div class="graph-editor">

  <drag-and-drop-layer :startDragEvent="startDragEvent"
    @drop="handleDrop" />
  <div class="editor-container">
    <palette :compilerConfig="compilerConfig"
      :chosenStatement="chosenPaletteStatement"
      @drag-start="handlePaletteDragStart" />
    <div class="graph-code">GRAPH EDITOR</div>
  </div>
</div>
</template>

<script>
import DragAndDropLayer from './DragAndDropLayer'
import Palette from './Palette'

export default {
  components: {
    DragAndDropLayer,
    Palette
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
    code: function(newCode, oldCode) {

    },
    compilerConfig: function(config, oldConfig) {
      // TODO: create available elements in the list
      console.log(config)
    }
  },
  methods: {
    handlePaletteDragStart(e) {
      this.startDragEvent = {
        ...e,
        isNew: true
      }
      console.log("#######STATEMENT", e.statement)
      this.chosenPaletteStatement = e.statement
    },
    handleDrop(e) {
      console.log("###GraphEditor drop", e)
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
            left: -90px;
            top: 0;
            margin: 40px 0 0;
        }

        .graph-code {
            position: relative;
            z-index: 10;
            height: 100%;
            background-color: #282c34;
        }
    }
}
</style>
