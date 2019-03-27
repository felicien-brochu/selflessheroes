<template>
<div id="app">
  <world />
  <res-split-pane split-to="columns" v-on:update:size="handleResize" :allow-resize="true" :size="400" :min-size="300" units="pixels" resizerColor="#4b5261" primary="second">
    <div slot="firstPane" />
    <editor slot="secondPane" v-on:run-ai="handleRunAI" v-model="code" />
  </res-split-pane>
</div>
</template>

<script>
import World from './components/World'
import Editor from './components/Editor'
import ResSplitPane from 'vue-resize-split-pane'

export default {
  components: {
    World,
    Editor,
    ResSplitPane
  },
  data: function() {
    return {
      code: 'return {\n\ttype: "move",\n\tx: 1,\n\ty: 1\n}',
    }
  },
  mounted() {},
  methods: {
    handleResize(e) {
      window.game.scene.keys.GameScene.handleResizeCamera(e)
    },
    handleRunAI() {
      window.game.scene.keys.GameScene.runAI(this.$data.code)
    }
  }
}
</script>

<style lang="scss">
body,
html {
    margin: 0;
    padding: 0;
    background-color: #a99ea2;
}

#app {
    margin: 0 auto;
}

.pane-rs .Pane:last-child {
    z-index: 20;
}
</style>
