<template>
<modal class="win-modal"
  ref="modal"
  type="info"
  :cancelable="hasWon"
  :hideButtons="!testAnimationEnded"
  :hideCloseButton="true"
  :cancelLabel="$text('win_modal_back_button')"
  :confirmLabel="$text('win_modal_continue_edit_button')"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="handleConfirm"
  @cancel="handleCancel"
  @click.native="handleModalClick">

  <div class="test-graph-container">
    <test-graph ref="graph"
      :tests="tests"
      :level="level"
      @animation-end="handleAnimationEnd" />
    <score-stars-animation v-if="testAnimationEnded && hasWon"
      :level="level"
      :hasWon="hasWon"
      :codeLength="codeLength"
      :averageStep="averageStep" />
    <p class="testing-explanation">{{$text('win_modal_testing_explanation')}}</p>
  </div>

  <transition name="fade-expand"
    appear>
    <div v-if="testAnimationEnded"
      class="score-container"
      ref="scoreContainer">
      <div class="score">
        <i class="mdi mdi-clock-fast" />:<span class="score-target"><span :class="{
						'score-number': true,
						'not-won': averageStep > level.speedTarget
					}">{{
						averageStep
					}}</span><span class="target-number">/{{
						level.speedTarget
					}}</span> {{$text('level_modal_speed_target_unit')}}</span>
      </div>
      <p v-if="hasPriorSpeed"
        :class="{
					'prior-score-phrase': true,
					'not-won': levelSolutions.score.minStep > level.speedTarget
				}"
        v-bbcode>{{priorSpeedText}}</p>

      <div class="score">
        <i class="mdi mdi-format-list-numbered" />:<span class="score-target"><span :class="{
							'score-number': true,
							'not-won': codeLength > level.lengthTarget
						}">{{
							codeLength
						}}</span><span class="target-number">/{{
							level.lengthTarget
						}}</span> {{$text('level_modal_length_target_unit')}}</span>
      </div>
      <p v-if="hasPriorLength"
        :class="{
					'prior-score-phrase': true,
					'not-won': levelSolutions.score.minLength > level.lengthTarget
				}"
        v-bbcode>{{priorLengthText}}</p>
      <p class="secondary-objectives-difficulty-warning"><i class="mdi mdi-information-outline" />{{$text('level_modal_secondary_objectives_difficulty_warning')}}</p>
    </div>
  </transition>
</modal>
</template>

<script>
import Modal from '../../modal/Modal'
import TestGraph from './TestGraph'
import ScoreStarsAnimation from './ScoreStarsAnimation'
import WinLevelTestWorker from './WinLevelTest.worker.js'
import Compiler from '../../../world/ai/compile/Compiler'

export default {
  components: {
    Modal,
    TestGraph,
    ScoreStarsAnimation
  },

  props: {
    'code': String,
    'level': Object,
    'levelSolutions': Object,
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
    let compiler = new Compiler(this.code, this.level.buildCompilerConfig())
    compiler.compile()
    return {
      tests: [],
      codeLength: compiler.computeCodeLength(),
      testAnimationEnded: false,
      hasPriorSpeed: this.levelSolutions.score.minStep >= 0,
      priorSpeedText: this.$text('win_modal_prior_code_speed', {
        minStep: this.levelSolutions.score.minStep
      }),
      hasPriorLength: this.levelSolutions.score.minLength >= 0,
      priorLengthText: this.$text('win_modal_prior_code_length', {
        minLength: this.levelSolutions.score.minLength
      })
    }
  },

  computed: {
    hasWon: function() {
      return this.tests.every(test => !test.hasLost)
    },

    averageStep: function() {
      let sum = this.tests.reduce((sum, next) => (sum + next.steps), 0)
      return Math.round(sum / this.tests.length)
    }
  },

  beforeDestroy() {
    if (this.worker) {
      this.worker.terminate()
    }
  },

  mounted() {
    this.worker = new WinLevelTestWorker()
    this.worker.addEventListener('message', this.handleWorkerResponse)
    this.worker.onerror = e => {
      console.error("WinLevelWorker error", e)
      this.$emit('close')
    }
    this.worker.postMessage({
      levelID: this.level.id,
      code: this.code
    })
  },

  methods: {
    confirm() {
      if (this.testAnimationEnded) {
        this.$refs.modal.confirm()
      }
      else {
        this.$refs.graph.speedUpTestAnimation()
      }
    },

    cancel() {
      if (this.testAnimationEnded) {
        this.$refs.modal.cancel()
      }
      else {
        this.$refs.graph.speedUpTestAnimation()
      }
    },

    handleWorkerResponse(e) {
      this.tests = e.data

      this.$emit('test-done', {
        tests: this.tests,
        codeLength: this.codeLength,
        averageStep: this.averageStep,
        hasWon: this.hasWon
      })
    },

    handleAnimationEnd() {
      if (!this.testAnimationEnded) {
        this.testAnimationEnded = true

        this.$nextTick(() => {
          if (this.tests.every(test => !test.hasLost)) {
            if (this.$refs.scoreContainer) {
              this.$refs.scoreContainer.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "start"
              })
            }
          }
          else {
            this.cancel()
          }
        })
      }
    },

    handleModalClick() {
      if (!this.testAnimationEnded) {
        this.$refs.graph.speedUpTestAnimation()
      }
    },

    handleCancel() {
      this.$emit('cancel', {
        tests: this.tests,
        codeLength: this.codeLength,
        averageStep: this.averageStep,
        hasWon: this.hasWon
      })
    },

    handleConfirm() {
      this.$emit('confirm', {
        tests: this.tests,
        codeLength: this.codeLength,
        averageStep: this.averageStep,
        hasWon: this.hasWon
      })
    }
  }
}
</script>

<style lang="scss">
.win-modal {
    color: white;
    padding: 45px 50px 30px;
    border-radius: 12px;
    box-shadow: inset 0 0 30px 10px rgba(0,0,0,0.2), 0 0 30px 10px rgba(0,0,0,1);
    background-color: #282c34;

    .modal-content {
        text-align: left;
        display: flex;
        flex-direction: column;
        overflow: hidden auto;
        max-width: 430px;

        .test-graph-container {
            position: relative;
            white-space: initial;
            margin-bottom: 14px;

            .score-stars-animation {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .testing-explanation {
                font-style: italic;
                font-size: 14px;
                color: #8f95a2;
                max-width: 430px;
                text-align: center;
                margin: 10px auto 0;
            }
        }

        .score-container {
            display: flex;
            flex-direction: column;
            opacity: 1;

            &.fade-expand-enter-active {
                transition: all 0.1s ease;
            }

            &.fade-expand-leave-active {
                transition: all 2s ease;
            }

            &.fade-expand-enter,
            &.fade-expand-leave-to {
                opacity: 0.5;
                transform: scale(1, 0.5) translate(0, -50%);
            }

            .score {
                text-align: left;
                font-size: 20px;
                margin: 5px 25px;
                color: transparentize(white, 0.1);

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

                    .score-number {
                        font-size: 24px;
                        margin-right: 4px;

                        &.not-won {
                            color: white;
                        }
                    }
                    .target-number {
                        margin-right: 2px;
                    }
                }
            }

            p {
                margin: 0 0 0 26px;
            }

            .score-number {
                font-weight: 800;
                color: #86b36d;
            }
            .not-won {
                .score-number {
                    color: white;
                }
            }
            .score-phrase {
                font-size: 20px;
                .score {
                    font-size: 24px;
                }
            }
            .prior-score-phrase {
                font-size: 16px;
                color: #cecece;
                .score {
                    font-size: 17px;
                }
            }

            .secondary-objectives-difficulty-warning {
                max-width: 430px;
                font-style: italic;
                font-size: 14px;
                color: #8f95a2;
                text-align: left;
                margin: 15px 7px 0;
                font-weight: 500;

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
        min-width: 300px;
        display: flex;
        justify-content: space-evenly;
        margin-top: 35px;

        button {
            background-color: lighten(#282c34, 10%);

            &:hover:not(:active) {
                background-color: lighten(#282c34, 12%);
            }
        }
    }
}
</style>
