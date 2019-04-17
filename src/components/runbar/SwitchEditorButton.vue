<template>
<button class="switch-editor-button"
  @click="switchEditor">
  {{ editorType }}
</button>
</template>

<script>
const graphEditorType = 'graph'
const codeEditorType = 'code'
const editorTypes = [graphEditorType, codeEditorType]

export default {
  props: {
    'editorType': {
      type: String,
      validator: type => editorTypes.includes(type)
    }
  },
  data: function() {
    return {}
  },
  methods: {
    switchEditor() {
      let newEditorType = this.editorType === graphEditorType ? codeEditorType : graphEditorType
      this.$emit('switch-editor', newEditorType)
    }
  }
}
</script>

<style lang="scss">
button.switch-editor-button {}
</style>
