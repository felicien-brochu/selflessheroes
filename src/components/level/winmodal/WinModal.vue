<template>
<modal class="win-modal"
  ref="modal"
  type="info"
  :cancelable="hasWon"
  :hideButtons="!testAnimationEnded"
  :hideCloseButton="true"
  :cancelLabel="$text('win_modal_continue_edit_button')"
  :confirmLabel="$text('win_modal_ok_button')"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="handleConfirm"
  @cancel="handleCancel"
  @mousedown.native="handleModalClick"
  @touchstart.native="handleModalClick">

  <test-graph ref="graph"
    :tests="tests"
    :level="level"
    @animation-end="handleAnimationEnd" />

  <transition name="fade-expand"
    appear>
    <div v-if="testAnimationEnded"
      class="score-container">
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
      <p v-if="levelSolutions.score.minStep >= 0"
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
      <p v-if="levelSolutions.score.minLength >= 0"
        :class="{
					'prior-score-phrase': true,
					'not-won': levelSolutions.score.minLength > level.lengthTarget
				}"
        v-bbcode>{{priorLengthText}}</p>
    </div>
  </transition>
</modal>
</template>

<script>
import Modal from '../../modal/Modal'
import TestGraph from './TestGraph'
import WinLevelTestWorker from './WinLevelTest.worker.js'
import Compiler from '../../../world/ai/compile/Compiler'
import AnchorStatement from '../../../world/ai/compile/statements/AnchorStatement'
import EndIfStatement from '../../../world/ai/compile/statements/EndIfStatement'

export default {
  components: {
    Modal,
    TestGraph
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
      statements: compiler.statements,
      testAnimationEnded: false
    }
  },

  computed: {
    codeLength: function() {
      let codeLength = 0
      for (let statement of this.statements) {
        if (!(statement instanceof AnchorStatement) && !(statement instanceof EndIfStatement)) {
          codeLength++
        }
      }
      return codeLength
    },

    hasWon: function() {
      return this.tests.every(test => !test.hasLost)
    },

    averageStep: function() {
      let sum = this.tests.map(test => test.steps).reduce((sum, next) => (sum + next))
      return Math.floor(sum / this.tests.length)
    },

    priorSpeedText: function() {
      return this.$text('win_modal_prior_code_speed', {
        minStep: this.levelSolutions.score.minStep
      })
    },

    priorLengthText: function() {
      return this.$text('win_modal_prior_code_length', {
        minLength: this.levelSolutions.score.minLength
      })
    },
  },

  beforeDestroy() {
    if (this.worker) {
      this.worker.terminate()
    }
  },

  mounted() {
    this.worker = new WinLevelTestWorker()
    this.worker.addEventListener('message', this.handleWorkerResponse)
    this.worker.onerror = function(e) {
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

      this.$emit('test-done', this.tests)
    },

    handleAnimationEnd() {
      if (!this.testAnimationEnded) {
        this.testAnimationEnded = true
        this.$emit('test-success', {
          tests: this.tests,
          codeLength: this.codeLength,
          averageStep: this.averageStep,
          hasWon: this.hasWon
        })

        this.$nextTick(() => {
          let content = this.$el.getElementsByClassName('modal-content')[0]
          content.scrollTo({
            top: content.scrollHeight,
            behavior: 'smooth'
          })
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
    box-shadow: inset 0 0 30px 10px #00000033, 0 0 30px 10px #000000;

    .modal-content {
        text-align: start;
        display: flex;
        flex-direction: column;
        overflow: hidden auto;

        .score-container {
            display: flex;
            flex-direction: column;
            transform: scale(1);
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
                text-align: start;
                font-size: 20px;
                margin: 20px 25px 5px;
                color: transparentize(white, 0.3);

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
                color: #8f95a2;
                .score {
                    font-size: 17px;
                }
            }

            .button-container {
                min-width: 300px;
                display: flex;
                justify-content: space-evenly;
                margin-top: 35px;
            }
        }
    }

    .button-container {
        margin-top: 25px;
    }
}
</style>
