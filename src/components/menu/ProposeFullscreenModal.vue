<template>
<modal class="propose-fullscreen-modal"
  ref="modal"
  type="info"
  :cancelable="true"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">
  <p>{{$text('app_fullscreen_modal')}}</p>
  <p><input type="checkbox"
      v-model="dontProposeFullscreen"
      id="dont-propose-fullscreen-checkbox" /><label for="dont-propose-fullscreen-checkbox">{{$text('app_fullscreen_modal_stop_propose')}}</label></p>
</modal>
</template>

<script>
import Modal from '../modal/Modal'

export default {
  components: {
    Modal
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
      dontProposeFullscreen: !this.preferences.proposeFullscreen
    }
  },

  watch: {
    dontProposeFullscreen: function(dontProposeFullscreen) {
      this.preferences.proposeFullscreen = !dontProposeFullscreen
    }
  },

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    },
  }
}
</script>

<style lang="scss">
.propose-fullscreen-modal {
    padding: 50px 50px 23px;

    .modal-content {
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;

        p {
            margin: 0;

            &:last-child {
                margin-top: 20px;
            }
        }

        label {
            font-size: 20px;
        }

        [type="checkbox"]:not(:checked) + label {
            opacity: 0.8;
        }

        [type="checkbox"]:checked,
        [type="checkbox"]:not(:checked) {
            position: absolute;
            left: -9999px;
        }
        [type="checkbox"]:checked + label,
        [type="checkbox"]:not(:checked) + label {
            position: relative;
            padding-left: 25px;
            cursor: pointer;
        }

        [type="checkbox"]:checked + label:before,
        [type="checkbox"]:not(:checked) + label:before {
            content: '';
            position: absolute;
            left: 0;
            top: 2px;
            width: 17px;
            height: 17px;
            border: 1px solid #aaa;
            background: #f8f8f8;
            border-radius: 3px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,.3);
        }

        [type="checkbox"]:checked + label:after,
        [type="checkbox"]:not(:checked) + label:after {
            content: '✔';
            position: absolute;
            top: 0;
            left: 4px;
            font-size: 14px;
            font-weight: 600;
            color: #5d84c7;
            line-height: 1.75;
            transition: all 0.1s;
        }

        [type="checkbox"]:not(:checked) + label:after {
            opacity: 0;
            transform: scale(0);
        }
        [type="checkbox"]:checked + label:after {
            opacity: 1;
            transform: scale(1);
        }

        [type="checkbox"]:disabled:checked + label:before,
        [type="checkbox"]:disabled:not(:checked) + label:before {
            box-shadow: none;
            border-color: #bbb;
            background-color: #ddd;
        }
        [type="checkbox"]:disabled:checked + label:after {
            color: #999;
        }
        [type="checkbox"]:disabled + label {
            color: #aaa;
        }

        [type="checkbox"]:checked:focus + label:before,
        [type="checkbox"]:not(:checked):focus + label:before {
            border: 1px dotted blue;
        }
    }

    .button-container {
        margin-top: 26px;
    }
}
</style>
