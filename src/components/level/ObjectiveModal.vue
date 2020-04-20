<template>
<transition name="objective-slide"
  appear>

  <div class="objective-modal internal-scroll"
    ref="modal"
    type="info"
    :cancelable="false"
    v-bind="$props"
    @close="$emit('close')"
    @confirm="$emit('confirm', $event)"
    @cancel="$emit('cancel', $event)">
    <div class="modal-content">

      <div class="level-name">
        <score-stars :score="solution.score"
          :level="level" />

        <div class="level-label">{{$text(level.getNameMessageKey())}}</div>
      </div>
      <div class="objective-modal-content">

        <div v-if="level.bossTellsSomething"
          class="boss-tell-container">
          <div :class="['boss-icon', `boss-icon-${level.bossName}`]" />
          <div class="boss-tell-balloon-container">
            <div class="speech-spike" />
            <div class="boss-tell-balloon">{{
					$text(level.getBossTellMessageKey())
				}}</div>
          </div>
        </div>

        <h4>{{$text('level_objective_modal_objective_title')}}</h4>
        <div class="objective-text"
          v-bbcode>{{$text(level.getObjectiveMessageKey())}}</div>

        <h4>{{$text('level_objective_modal_secondary_objectives_title')}}</h4>

        <div class="score">
          <i class="mdi mdi-clock-fast" />:<span class="score-target"><span class="target-number">{{level.speedTarget}}</span> {{$text('level_modal_speed_target_unit')}}</span>
        </div>

        <div class="score">
          <i class="mdi mdi-format-list-numbered" />:<span class="score-target"><span class="target-number">{{level.lengthTarget}}</span> {{$text('level_modal_length_target_unit')}}</span>
        </div>

        <p class="secondary-objectives-difficulty-warning"><i class="mdi mdi-information-outline" />{{$text('level_modal_secondary_objectives_difficulty_warning')}}</p>

      </div>
    </div>
    <div class="button-container">
      <button type="submit"
        :title="$text('modal_confirm_button')"
        @click="confirm()"
        @touchstart="confirm()">{{
			$text('modal_confirm_button')
		}}</button>
    </div>
  </div>

</transition>
</template>

<script>
import ScoreStars from '../levellist/ScoreStars'

export default {
  components: {
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
    confirm(confirmValue) {
      this.$emit('confirm', confirmValue)
      this.$emit('close')
    },

    cancel(confirmValue) {
      this.$emit('cancel', confirmValue)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import './mixins';

.objective-modal {
    $modal-color: #3C404A;
    $text-color: white;
    background-color: $modal-color;
    color: $text-color;

    .close-button {
        color: $text-color;
    }

    .button-container button {
        background-color: lighten($modal-color, 10%);
        color: $text-color;

        &:hover:not(:active) {
            background-color: lighten($modal-color, 12%);
        }
    }
    padding: 30px;
    width: max-content;
    min-width: 492px;
    position: absolute;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 100px 10px rgba(0,0,0,0.66);
    border-left: solid 2px #4b5261;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    right: 0;

    .modal-content {
        display: flex;
        flex-direction: column;

        .level-name {
            display: flex;
            flex-grow: 1;
            margin-bottom: 25px;

            .score-stars {
                width: 64px;
            }

            .level-label {
                font-family: 'Born2bSportyV2', 'Roboto', "Noto", Arial, sans-serif;
                font-size: 40px;
                margin-left: 10px;
            }
        }

        .boss-tell-container {
            display: flex;
            align-items: stretch;
            margin-bottom: 12px;

            .boss-icon {
                min-width: 100px;
                min-height: 80px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: bottom;
            }

            .boss-tell-balloon-container {
                position: relative;
                margin-left: 40px;
                white-space: normal;

                .boss-tell-balloon {
                    background-color: #282C34;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    padding: 10px 18px 12px 12px;
                    color: #8f95a2;
                    font-style: italic;
                    font-size: 18px;
                    white-space: pre-line;
                }

                .speech-spike {
                    position: absolute;
                    display: block;
                    width: 0;
                    border-style: solid;
                    border-width: 30px 30px 30px 0;
                    border-color: transparent #282C34;
                    left: -14px;
                    bottom: -6px;
                    transform: translateY(-50%) scaleY(0.55) rotate(230deg);
                }
            }
        }

        .objective-modal-content {
            display: flex;
            flex-direction: column;
            overflow: auto;
            max-width: 500px;

            h4 {
                text-align: left;
                margin: 0 0 10px;
                font-weight: 500;
                font-size: 20px;
                opacity: 0.5;
            }

            .objective-text {
                text-align: center;
                font-size: 20px;
                margin: 0 25px 35px;

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
                .speach-statement {
                    @include node-color($speach-color);
                }
            }

            .score {
                text-align: left;
                font-size: 20px;
                margin: 0 25px 5px;

                i {
                    vertical-align: text-top;
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

            .secondary-objectives-difficulty-warning {
                font-style: italic;
                font-size: 14px;
                color: #7b8292;
                margin: 4px 0 7px;
                text-align: left;
                font-weight: 500;
                background-color: #373b44;
                border-radius: 6px;
                padding: 8px 12px;
                box-sizing: border-box;

                i.mdi-information-outline {
                    float: left;
                    font-size: 23px;
                    margin-right: 6px;
                    line-height: 28px;
                }
            }
        }
    }

    .button-container {
        margin-top: 20px;
        min-width: 300px;
        display: flex;
        justify-content: space-evenly;

        button {
            font-weight: 500;
            min-width: 100px;
            font-size: 21px;
            padding: 9px 20px;
            border-radius: 3px;
            box-shadow: inset 0 0 10px 3px rgba(0,0,0,0.2), 0 0 10px 0 rgba(0,0,0,0.2);
        }
    }
}

.objective-slide-enter-active {
    transition: transform 0.35s ease;
}

.objective-slide-leave-active {
    transition: transform 0.2s ease;
}

.objective-slide-enter,
.objective-slide-leave-to {
    transform: translate(100%);
}
</style>
