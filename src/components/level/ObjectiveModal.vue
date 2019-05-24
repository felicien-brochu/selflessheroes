<template>
<modal class="objective-modal"
  ref="modal"
  type="info"
  :cancelable="false"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <div class="level-name">
    <score-stars :score="solution.score"
      :level="level" />

    <div class="level-label">{{level.name}}</div>
  </div>
  <div class="objective-modal-content">

    <h4>{{$text('level_objective_modal_objective_title')}}</h4>
    <div class="objective-text"
      v-bbcode>{{level.objective}}</div>

    <h4>{{$text('level_objective_modal_secondary_objectives_title')}}</h4>

    <div class="score">
      <i class="mdi mdi-clock-fast" />:<span class="score-target"><span class="target-number">{{level.speedTarget}}</span> {{$text('level_modal_speed_target_unit')}}</span>
    </div>

    <div class="score">
      <i class="mdi mdi-format-list-numbered" />:<span class="score-target"><span class="target-number">{{level.lengthTarget}}</span> {{$text('level_modal_length_target_unit')}}</span>
    </div>

  </div>
</modal>
</template>

<script>
import Modal from '../modal/Modal'
import ScoreStars from '../levellist/ScoreStars'

export default {
  components: {
    Modal,
    ScoreStars
  },
  props: {
    'level': {
      type: Object
    },
    'solution': {
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

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    }
  }
}
</script>

<style lang="scss">
@import './mixins';

.objective-modal {
    padding: 37px 50px 30px;
    min-width: 485px;

    .modal-content {
        display: flex;
        flex-direction: column;

        .level-name {
            display: flex;
            flex-grow: 1;

            .score-stars {
                width: 64px;
            }

            .level-label {
                font-weight: bold;
                font-size: 30px;
                margin-left: 10px;
            }
        }

        .objective-modal-content {
            display: flex;
            flex-direction: column;
            overflow: auto;
            max-width: 500px;

            h4 {
                text-align: start;
                margin: 0 0 10px;
                font-weight: 500;
                font-size: 20px;
                opacity: 0.5;
                margin-top: 25px;
            }

            .objective-text {
                text-align: center;
                font-size: 20px;
                margin: 0 25px 10px;

                .icon {
                    width: 24px;
                    height: 24px;
                    display: inline-block;
                    background-size: cover;
                    vertical-align: bottom;
                }

                .statement {
                    border-radius: 4px;
                    font-weight: 500;
                    padding: 0 10px 0 5px;
                }

                .action-statement {
                    @include node-color($action-color);
                }
                .branching-statement {
                    @include node-color($branching-color);
                }
                .assign-statement {
                    @include node-color($assign-color);
                }
            }

            .score {
                text-align: start;
                font-size: 20px;
                margin: 0 25px 5px;

                i {
                    vertical-align: middle;
                    font-size: 26px;
                    margin-right: 4px;
                }

                .score-target {
                    vertical-align: middle;
                    margin-left: 14px;
                    font-size: 20px;
                    line-height: 24px;

                    .target-number {
                        font-size: 24px;
                        margin-right: 2px;
                        font-weight: 800;
                        color: #86b36d;
                    }
                }
            }
        }
    }

    .button-container {
        margin-top: 17px;
    }
}
</style>
