<template>
<modal class="premium-modal"
  :cancelable="false"
  :hideButtons="true"
  :frameWidth="frameWidth"
  :frameHeight="frameHeight"
  type="info"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">
  <h3>{{$text('premium_modal_title')}}</h3>

  <p class="premium-content-description"
    v-bbcode>{{$text('premium_modal_content_description')}}</p>

  <div class="premium-action">
    <div class="colored-side-bar category-color-yellow" />
    <div class="premium-action-description">
      <simple-graph-code :code="'$a = calc(3 * 5)\nwrite(6)\n'"
        :compilerConfig="defaultCompilerConfig" />
      <p>{{$text('premium_modal_action_variables')}}</p>
    </div>
    <div class="premium-action-image">
      <img src="../images/premium-variables-animation.png"
        class="premium-action-animation"
        :alt="$text('premium_modal_action_variables')" />
    </div>
  </div>

  <div class="premium-action">
    <div class="colored-side-bar category-color-red" />
    <div class="premium-action-description">
      <simple-graph-code :code="'tell(\'hey\' w)\nlisten(\'ho\')'"
        :compilerConfig="defaultCompilerConfig" />
      <p>{{$text('premium_modal_action_speach')}}</p>
    </div>
    <div class="premium-action-image">
      <img src="../images/premium-speach-animation.png"
        class="premium-action-animation"
        :alt="$text('premium_modal_action_speach')" />
    </div>
  </div>

  <div class="premium-action">
    <div class="colored-side-bar category-color-purple" />
    <div class="premium-action-description">
      <simple-graph-code :code="'clone e a'"
        :compilerConfig="defaultCompilerConfig" />
      <p>{{$text('premium_modal_action_clone')}}</p>
    </div>
    <div class="premium-action-image">
      <img src="../images/premium-clone-animation.png"
        class="premium-action-animation"
        :alt="$text('premium_modal_action_clone')" />
    </div>
  </div>

  <div class="button-container">
    <button type="button"
      :title="$text('premium_modal_back_button')"
      @mousedown="cancel()"
      @touchstart="cancel()">{{
			$text('premium_modal_back_button')
	}}</button>
    <button type="button"
      class="unlock-button"
      :title="$text('premium_modal_unlock_button')"
      @mousedown="confirm()"
      @touchstart="confirm()">{{
			$text('premium_modal_unlock_button')
	}}</button>
  </div>

</modal>
</template>

<script>
import Modal from '../modal/Modal'
import SimpleGraphCode from '../level/help/SimpleGraphCode'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'

export default {
  components: {
    Modal,
    SimpleGraphCode,
  },
  props: {
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
    defaultCompilerConfig: function() {
      return CompilerConfig.getDefault()
    }
  },

  methods: {
    confirm() {
      this.$emit('close')
      this.$emit('confirm')
    },

    cancel() {
      this.$emit('close')
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
.premium-modal {
    background: #3C404A;
    border-radius: 12px;
    box-shadow: inset 0 0 30px 10px rgba(0,0,0,0.2), 0 0 30px 10px rgba(0,0,0,0.26);

    .modal-content {
        margin: 0 23px;

        h3 {
            margin: 0;
            font-size: 30px;
            font-weight: 500;
        }

        .premium-content-description {
            width: 510px;
            margin: auto;
            padding-left: 18px;
            box-sizing: border-box;

            .content-number {
                font-size: 28px;
                color: #86b36d;
                font-weight: bold;
            }
        }

        .premium-action-animation {
            width: 140px;
            border-radius: 4px;
            display: block;
        }

        .premium-action {
            display: flex;
            flex-direction: row;
            width: min-content;
            align-items: center;
            font-size: 20px;
            margin: auto;
            background-color: #333740;
            border-radius: 15px;
            min-width: 510px;

            .colored-side-bar {
                min-width: 24px;
                align-self: stretch;
                border-radius: 15px 0 0 15px;
            }

            & > :nth-child(2) {
                padding: 12px 0 12px 24px;
            }

            .premium-action-description {
                min-width: 260px;
                padding: 16px 28px;
                margin: auto;
            }

            .premium-action-image {
                width: 140px;
                padding: 12px 12px 12px 0;
            }

            p {
                margin: 14px 0 0;
            }

            .simple-graph-code {
                display: inline-block;
                width: min-content;

                .node {
                    margin-left: auto;
                    margin-right: auto;
                }
            }
        }

        .button-container {
            align-items: center;
            padding-bottom: 10px;
            margin-top: 10px;

            .unlock-button {
                background-color: #557cca;
                border-radius: 3px;

                &:hover {
                    background-color: #557cca;
                }
            }
        }
    }
}
</style>
