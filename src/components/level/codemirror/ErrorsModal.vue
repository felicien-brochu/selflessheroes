<template>
<modal class="errors-modal"
  :cancelable="false"
  :frameWidth="frameWidth"
  :frameHeight="frameHeight"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <h3>{{$text('errors_modal_title')}}</h3>
  <ul class="error-list">

    <li v-for="error in errors">

      <div class="error-position">{{
				$text('code_error_position_template', {
					line: error.line
				})
			}}</div>

      <div class="error-description"
        v-bbcode="'type'">{{error.message}}</div>
      </div>
    </li>

  </ul>
</modal>
</template>

<script>
import Modal from '../../modal/Modal'

export default {
  components: {
    Modal
  },
  props: {
    'compilerExceptions': {
      type: Object
    },
    'frameWidth': {
      type: Number,
      default: window.innerWidth
    },
    'frameHeight': {
      type: Number,
      default: window.innerHeight
    }
  },
  computed: {
    errors: function() {
      let errors = []

      for (let exception of this.compilerExceptions.fatal) {
        let message = exception.message.substring(1) + exception.type

        if (exception.template) {
          message = this.$text(exception.template.template, exception.template.values)
        }
        else {
          console.error('This exception has no template:', exception)
        }
        errors.push({
          line: exception.line + 1,
          column: exception.column + 1,
          statement: exception.statement,
          message: message
        })
      }
      return errors
    }
  },

  methods: {
    confirm() {
      this.$emit('confirm')
      this.$emit('close')
    },

    cancel() {
      this.$emit('cancel')
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
$main-color: #4d2e4a;
.modal.errors-modal {
    .modal-content {

        h3 {
            margin: 0;
            font-size: 30px;
            font-weight: 500;
        }

        .error-list {
            font-size: 16px;
            display: flex;
            flex-direction: column;
            background: $main-color;
            padding: 0;
            border-radius: 12px;
            overflow: auto;

            -webkit-touch-callout: text;
            -webkit-user-select: text;
            -khtml-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;

            li {
                display: flex;
                flex-direction: row;
                line-height: 25px;

                &:nth-child(2n+1) {
                    background: darken($main-color, 2%);
                }

                .error-position {
                    width: 90px;
                    box-sizing: border-box;
                    flex-shrink: 0;
                    color: darken($main-color, 12%);
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    padding: 10px 8px 10px 12px;
                    text-align: start;
                    border-right: solid 2px darken($main-color, 4%);
                }
                .error-description {
                    color: white;
                    padding: 10px 12px;
                    text-align: start;
                    white-space: pre-line;

                    .code-segment {
                        font-family: Consolas, 'DejaVu Sans Mono', monospace;
                        background-color: #282C34;
                        padding: 2px 4px;
                        border-radius: 5px;
                    }
                }
            }
        }
    }
}
</style>
