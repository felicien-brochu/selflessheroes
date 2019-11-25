<template>
<modal class="unlock-premium-modal"
  :cancelable="false"
  :hideButtons="true"
  :frameWidth="frameWidth"
  :frameHeight="frameHeight"
  :hideTransition="true"
  type="info"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">
  <h3>{{$text('unlock_premium_modal_title')}}</h3>
  <p><a type="button"
      class="link-button"
      :title="$text('unlock_premium_modal_get_key_button')"
      :href="activationKeyURL"
      @click="onGetActivationKeyLinkClick"
      target="_blank">{{
				$text('unlock_premium_modal_get_key_button')
		}}<i class="mdi mdi-arrow-right-circle" /></a>
  </p>

  <form @submit.prevent="activatePremium">
    <label for="activation-key-input">{{
			$text('unlock_premium_modal_activation_key_label')
		}}</label>
    <input v-focus
      id="activation-key-input"
      type="text"
      name="activationKey"
      v-model="activationKey"
      maxlength="14"
      :placeholder="$text('unlock_premium_modal_activation_key_placeholder')" />

    <p v-if="wrongActivationKey"
      class="wrong-activation-key-message">{{
			$text('unlock_premium_modal_wrong_activation_key')
		}}</p>
  </form>

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
      @mousedown="activatePremium"
      @touchstart="activatePremium">{{
			$text('premium_modal_unlock_button')
	}}</button>
  </div>

</modal>
</template>

<script>
import Modal from '../modal/Modal'
import CompilerConfig from '../../world/ai/compile/CompilerConfig'
import storage from '../../game/storage/Storage'

export default {
  components: {
    Modal,
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
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

  data: function() {
    return {
      activationKey: "",
      wrongActivationKey: false,
    }
  },

  computed: {
    defaultCompilerConfig: function() {
      return CompilerConfig.getDefault()
    },
    activationKeyURL: function() {
      return ACTIVATION_KEY_URL + '?fromGame=true&gameVersion=' + GAME_VERSION
    }
  },

  methods: {
    activatePremium() {
      if (storage.activatePremium(this.activationKey)) {
        this.wrongActivationKey = false
        this.confirm()
      }
      else {
        this.wrongActivationKey = true
      }
    },

    onGetActivationKeyLinkClick(e) {
      if (IS_ELECTRON) {
        e.preventDefault()
        const electronWindow = require('electron').remote.getCurrentWindow()
        electronWindow.openLink(this.activationKeyURL)
      }
    },

    confirm() {
      this.$emit('confirm')
      this.$emit('close')
    },

    cancel() {
      this.$emit('cancel')
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss">
.unlock-premium-modal {
    background: #3C404A;
    border-radius: 12px;
    box-shadow: inset 0 0 30px 10px #00000033, 0 0 30px 10px #00000044;

    .modal-content {
        white-space: pre-line;

        h3 {
            margin: 0 0 45px;
            font-size: 30px;
            font-weight: 500;
        }

        label {
            font-size: 20px;
            margin-right: 8px;
        }

        input[type=text] {
            width: 138px;
            font-size: 18px;
            color: white;
            font-weight: normal;
            padding: 10px 14px;
            background: #2a2c33;
            border-radius: 4px;
            font-family: Consolas, monospace;
            border: none;

            &::placeholder {
                color: transparentize(white, 0.5);
            }
        }

        .wrong-activation-key-message {
            color: #D03F3F;
            font-size: 16px;
        }

        .link-button {
            display: inline-block;
            text-decoration: none;
            background: #568AF2;
            margin: 5px;
            padding: 0 5px 0 15px;
            outline: none;
            border: none;
            cursor: pointer;
            color: white;
            font-size: 18px;
            font-weight: 500;
            border-radius: 16px;
            box-shadow: 0 0 7px 0 #00000066;
            line-height: 32px;
            margin-bottom: 14px;

            .mdi-arrow-right-circle {
                display: inline-flex;
                font-size: 25px;
                margin-left: 8px;
                vertical-align: bottom;
            }
        }

        .button-container {
            align-items: center;
            padding-bottom: 10px;
            margin-top: 45px;

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
