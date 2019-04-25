<template>
<div class="editor-bar">

  <div :class="{
		'code-state-container': true,
		'hidden': !isCodeEditor
	}">
    <button :class="['code-state', codeState]"
      :title="codeStateToolTip" />
  </div>

  <div class="center-container">
    <button class="undo-button"
      :disabled="!codeHistory.canUndo()"
      @click="handleUndoClick">
      <i :class="{
			'material-icons': true,
			'md-light': true,
			'md-inactive': !codeHistory.canUndo()
			}">undo</i>
    </button>

    <button class="redo-button"
      :disabled="!codeHistory.canRedo()"
      @click="handleRedoClick">
      <i :class="{
			'material-icons': true,
			'md-light': true,
			'md-inactive': !codeHistory.canRedo()
			}">redo</i>
    </button>

    <button class="delete-code-button"
      :disabled="code.length === 0"
      @click="handleRemoveCodeClick">
      <i :class="{
			'material-icons': true,
			'md-light': true,
			'md-inactive': code.length === 0
			}">delete</i>
    </button>
  </div>


  <toggle-button :value="isCodeEditor"
    :switchColor="{checked: '#252930', unchecked: '#252930', disabled: '#252930'}"
    :color="{checked: '#5d84c7', unchecked: '#FFFFFF', disabled: '#CCCCCC'}"
    :sync="true"
    :slave="true"
    :font-size="12"
    :width="30"
    :height="18"
    :labels="false"
    @change="$emit('switch-editor', editorType === 'code' ? 'graph' : 'code')" />

</div>
</template>

<script>
import ToggleButton from './ToggleButton'

export default {
  components: {
    ToggleButton
  },
  props: {
    'code': {
      type: String,
      default: ''
    },
    'codeHistory': {
      type: Object
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
    'codeState': {
      type: String
    }
  },

  computed: {
    codeStateToolTip: function() {
      let tip = ''

      if (this.codeState === 'code-ok') {
        tip = this.$text('code_state_ok_tooltip')
      }
      else if (this.codeState === 'code-not-runnable') {
        tip = this.$text('code_state_not_runnable_tooltip')
      }
      else if (this.codeState === 'code-not-compilable') {
        tip = this.$text('code_state_not_compilable_tooltip')
      }
      return tip
    },
    isCodeEditor: function() {
      return this.editorType === 'code'
    }
  },

  methods: {
    handleRemoveCodeClick(event) {
      this.$emit('remove-code')
      event.target.blur()
    },
    handleUndoClick(event) {
      this.$emit('undo')
      event.target.blur()
    },
    handleRedoClick(event) {
      this.$emit('redo')
      event.target.blur()
    }
  }
}
</script>

<style lang="scss">
.editor-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    height: 42px;
    background-color: #252930;

    button {
        font-size: 32px;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        height: 40px;
        margin: 0 7px;
    }

    .vue-js-switch {}

    .center-container {
        flex: 1;
        max-width: 400px;
        display: flex;
        justify-content: space-around;
        margin: 0 18px;
    }

    .code-state-container {
        width: 16px;
        height: 16px;
        line-height: 0;
        margin-right: 14px;

        &.hidden {
            visibility: hidden;
        }

        .code-state {
            height: 16px;
            width: 16px;
            margin: 0;
            border: none;
            background: none;
            border-radius: 8px;
            $margin: 25px;
            cursor: pointer;

            transition-property: background-color, width, height, margin-right, border-radius;
            transition-duration: 150ms;

            &.code-ok {
                cursor: initial;
                background-color: #779666;

                &:active,
                &:hover {
                    box-shadow: 0 0 10px #779666;
                }
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
    }
}
</style>
