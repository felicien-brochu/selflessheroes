<template>
<div class="graph-editor">

  <palette :compilerConfig="compilerConfig" />
  GRAPH EDITOR

</div>
</template>

<script>
import Palette from './Palette'

export default {
  components: {
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
    return {}
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

  }
}
</script>

<style lang="scss">
.graph-editor {
    color: white;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: visible;

    .palette {
        position: absolute;
        left: -122px;
        top: 0;
        z-index: -1;
        margin: 40px 0 0;
    }
}
</style>
