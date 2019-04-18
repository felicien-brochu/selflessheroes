<template>
<div class="editor-bar">
  <button :class="['code-state', codeState]"
    :title="codeStateToolTip" />

  <button class="delete-code-button"
    :disabled="code.length === 0"
    @click="handleRemoveCodeClick">Remove Code</button>

  <switch-editor-button :editorType="editorType"
    @switch-editor="$emit('switch-editor', $event)" />
</div>
</template>

<script>
import SwitchEditorButton from './SwitchEditorButton'

export default {
  components: {
    SwitchEditorButton
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'worldState': {
      type: Object
    },
    'worldReady': {
      type: Boolean,
      default: false
    },
    'aiReady': {
      type: Boolean,
      default: false
    },
    'editorType': {
      type: String,
      validator: type => ['graph', 'code'].includes(type)
    },
    'compilerExceptions': {
      type: Object
    }
  },
  data: function() {
    return {
      codeState: 'code-ok'
    }
  },
  computed: {
    codeStateToolTip: function() {
      let tip = ''
      if (this.codeState === 'code-not-runnable') {
        tip = 'Your instructions are not complete:\nclick for more info.'
      }
      else if (this.codeState === 'code-not-compilable') {
        tip = 'There is an error in your code:\nclick for more info.'
      }
      return tip
    }
  },
  watch: {
    compilerExceptions: function() {
      let state = 'code-ok'
      if (!this.compilerExceptions || this.compilerExceptions.fatal.length > 0) {
        state = 'code-not-compilable'
      }
      else if (this.compilerExceptions && this.compilerExceptions.undefinedLiterals.length > 0) {
        state = 'code-not-runnable'
      }
      this.codeState = state
    }
  },

  methods: {
    handleRemoveCodeClick(event) {
      this.$emit('remove-code')
      event.target.blur()
    }
  }
}
</script>

<style lang="scss">
.editor-bar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 5px;
    height: 42px;
    background-color: #252930;

    .code-state {
        height: 16px;
        width: 16px;
        margin: 0;
        border: none;
        background: none;
        border-radius: 8px;
        position: absolute;
        $margin: 25px;
        right: $margin;
        cursor: pointer;

        transition-property: background-color, width, height, right, border-radius;
        transition-duration: 150ms;

        &.code-ok {
            background-color: #479956;
            width: 0;
            height: 0;
            right: $margin + 8px;
            border-radius: 0;
        }
        &.code-not-runnable {
            background-color: #b46f37;
            &:active,
            &:hover {
                box-shadow: 0 0 10px #b46f37;
            }
        }
        &.code-not-compilable {
            background-color: #af3636;
            &:active,
            &:hover {
                box-shadow: 0 0 10px #af3636;
            }
        }
    }

    button {
        font: inherit;
        cursor: pointer;
        outline: inherit;
        height: 40px;
        box-shadow: 0 1px 6px 0 black;
        margin: 0 7px;

        &:hover {
            box-shadow: 0 1px 6px 0 #656565;
        }
        &:active {
            background-color: rgb(75, 75, 75);
        }

        &:disabled {
            opacity: 0.3;
            &:hover {
                box-shadow: inherit;
            }
            &:active {
                background-color: inherit;
            }
        }
    }
}
</style>
