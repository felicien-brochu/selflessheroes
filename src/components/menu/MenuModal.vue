<template>
<modal class="menu-modal"
  ref="modal"
  type="info"
  :cancelable="false"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <table class="menu-modal-content">
    <tr class="fullscreen-preference"
      v-if="showFullscreenPreference">
      <td>{{$text('menu_fullscreen_label')}}</td>
      <td>
        <toggle-button :value="fullscreenEnabled"
          :switchColor="{checked: '#252930', unchecked: '#252930', disabled: '#252930'}"
          :color="{checked: '#5d84c7', unchecked: '#FFFFFF', disabled: '#CCCCCC'}"
          :sync="true"
          :slave="true"
          :font-size="12"
          :width="42"
          :height="24"
          :labels="false"
          :title="fullscreenToggleTitle"
          @change="toggleFullscreen" />
      </td>
    </tr>
    <tr class="sound-preference">
      <td>{{$text('menu_sound_label')}}</td>
      <td>
        <volume tag="div"
          :volume="preferences.soundVolume" />
      </td>
    </tr>
    <tr class="sound-preference"
      v-if="false">
      <td>{{$text('menu_music_label')}}</td>
      <td>
        <volume tag="div"
          :volume="preferences.musicVolume" />
      </td>
    </tr>
  </table>

  </div>
</modal>
</template>

<script>
import isElectron from 'is-electron'
import Modal from '../modal/Modal'
import Volume from './Volume'
import ToggleButton from '../inputs/ToggleButton'

export default {
  components: {
    Modal,
    ToggleButton,
    Volume
  },
  props: {
    'preferences': {
      type: Object
    },
    'confirmValue': {
      default: true
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

  data: function() {
    return {
      fullscreenEnabled: this.isFullscreenEnabled()
    }
  },

  computed: {
    showFullscreenPreference: function() {
      return !isElectron()
    },
    fullscreenToggleTitle: function() {
      return this.fullscreenEnabled ? this.$text('menu_disable_fullscreen') : this.$text('menu_enable_fullscreen')
    }
  },

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    },

    isFullscreenEnabled() {
      return !!document.fullscreenElement
    },

    toggleFullscreen() {
      if (this.isFullscreenEnabled()) {
        document.exitFullscreen().then(() => {
          this.fullscreenEnabled = false
        }).catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
        })
      }
      else {
        document.body.requestFullscreen().then(() => {
          this.fullscreenEnabled = true
        }).catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.menu-modal {
    padding: 30px 50px 23px;

    .modal-content {
        display: flex;
        flex-direction: column;

        .menu-modal-content {
            overflow: auto;
            max-width: 500px;

            tr {
                td {
                    text-align: start;

                    &:first-child {
                        padding-right: 28px;
                        text-align: end;
                    }
                }
            }
        }
    }

    .button-container {
        margin-top: 26px;
    }
}
</style>
