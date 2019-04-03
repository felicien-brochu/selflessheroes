<template>
<div class="graph-editor">

  GRAPH EDITOR

</div>
</template>

<script>
export default {
  components: {},
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
    width: 100%;
    height: 100%;
}
</style>
