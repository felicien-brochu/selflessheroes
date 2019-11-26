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
      <td>{{$text('menu_music_label')}}</td>
      <td>
        <volume tag="div"
          :volume="preferences.musicVolume" />
      </td>
    </tr>
    <tr class="sound-preference">
      <td>{{$text('menu_sound_label')}}</td>
      <td>
        <volume tag="div"
          :volume="preferences.soundVolume" />
      </td>
    </tr>
    <tr class="link-preference">
      <td>{{$text('menu_credits_label')}}</td>
      <td>
        <external-link :title="$text('menu_credits_link')"
          :href="creditsURL">{{
							$text('menu_credits_link')
					}}</external-link>
      </td>
    </tr>
    <tr>
      <td>{{$text('menu_game_version_label')}}</td>
      <td class="game-version">{{
				gameVersion
      }}</td>
    </tr>
  </table>
</modal>
</template>

<script>
import Modal from '../modal/Modal'
import Volume from './Volume'
import ToggleButton from '../inputs/ToggleButton'
import ExternalLink from '../common/ExternalLink'

export default {
  components: {
    Modal,
    ToggleButton,
    Volume,
    ExternalLink,
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

  created() {
    this.onPreferenceChange = this.onPreferenceChange.bind(this)
    this.preferences.soundVolume.events.on('change', this.onPreferenceChange)
    this.preferences.musicVolume.events.on('change', this.onPreferenceChange)
  },

  beforeDestroy() {
    this.preferences.soundVolume.events.off('change', this.onPreferenceChange)
  },

  computed: {
    showFullscreenPreference: function() {
      return !IS_ELECTRON && typeof document.body.requestFullscreen === 'function'
    },
    fullscreenToggleTitle: function() {
      return this.fullscreenEnabled ? this.$text('menu_disable_fullscreen') : this.$text('menu_enable_fullscreen')
    },
    creditsURL: function() {
      return CREDITS_URL + '?fromGame=true&gameVersion=' + GAME_VERSION
    },
    gameVersion: function() {
      return GAME_VERSION
    }
  },

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    },

    onPreferenceChange() {
      this.$emit('preference-change')
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

            .link-preference {
                & > td {
                    padding-top: 20px;

                    .external-link {
                        margin: 5px;
                    }
                }
            }

            .game-version {
                font-family: 'Consolas', monospace;
                user-select: text;
                padding: 7px;
            }

            tr {
                td {
                    text-align: left;

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
