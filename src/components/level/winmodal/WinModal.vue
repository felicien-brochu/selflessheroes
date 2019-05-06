<template>
<div class="win-modal"
  @mousedown="handleModalClick"
  @touchstart="handleModalClick">

  <test-graph ref="graph"
    :tests="tests"
    :level="level"
    @animation-end="testAnimationEnded = true" />

  <transition name="fade-expand"
    appear>
    <div v-if="tests.length > 0 && testAnimationEnded"
      class="score-container">
      <p class="score-phrase"
        v-bbcode>{{speedText}}</p>

      <p v-if="levelSolutions.score.minStep >= 0"
        class="prior-score-phrase"
        v-bbcode>{{priorSpeedText}}</p>

      <p class="score-phrase"
        v-bbcode>{{lengthText}}</p>

      <p v-if="levelSolutions.score.minLength >= 0"
        class="prior-score-phrase"
        v-bbcode>{{priorLengthText}}</p>

      <div class="button-container">

        <button v-if="hasWon"
          type="button"
          @click="handleContinueButtonClick"
          :title="$text('win_modal_continue_edit_button')">{{
					$text('win_modal_continue_edit_button')
				}}</button>

        <button type="button"
          @click="handleOkButtonClick"
          :title="$text('win_modal_ok_button')">{{
					$text('win_modal_ok_button')
				}}</button>

      </div>
    </div>
  </transition>
</div>
</template>

<script>
import TestGraph from './TestGraph'
import WinLevelTestWorker from './WinLevelTest.worker.js'
import Compiler from '../../../world/ai/compile/Compiler'
import AnchorStatement from '../../../world/ai/compile/statements/AnchorStatement'
import EndIfStatement from '../../../world/ai/compile/statements/EndIfStatement'

export default {
  components: {
    TestGraph
  },

  props: {
    'code': String,
    'level': Object,
    'levelSolutions': Object
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
      let won = true
      return this.tests.every(test => !test.hasLost)
    },

    averageStep: function() {
      let sum = this.tests.map(test => test.steps).reduce((sum, next) => (sum + next))
      return Math.floor(sum / this.tests.length)
    },

    speedText: function() {
      return this.$text('win_modal_code_speed', {
        speedTarget: this.level.speedTarget,
        codeSpeed: this.averageStep
      })
    },

    priorSpeedText: function() {
      return this.$text('win_modal_prior_code_speed', {
        minStep: this.levelSolutions.score.minStep
      })
    },

    lengthText: function() {
      return this.$text('win_modal_code_length', {
        lengthTarget: this.level.lengthTarget,
        codeLength: this.codeLength
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
    }
    this.worker.postMessage({
      levelID: this.level.id,
      code: this.code
    })
  },

  methods: {
    handleWorkerResponse(e) {
      this.tests = e.data
    },

    handleModalClick() {
      this.$refs.graph.speedUpTestAnimation()
    },

    handleContinueButtonClick() {
      this.$emit('close', {
        action: 'continue',
        tests: this.tests,
        codeLength: this.codeLength,
        averageStep: this.averageStep,
        hasWon: this.hasWon
      })
    },

    handleOkButtonClick() {
      this.$emit('close', {
        action: 'confirm',
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
$modal-color: #282c34;
.win-modal {
    color: white;
    padding: 47px 50px 30px;
    background: $modal-color;
    border-radius: 12px;
    box-shadow: inset 0 0 30px 10px #00000033, 0 0 30px 10px #000000;

    .graph-container {
        margin-bottom: 40px;
    }

    .score-container {
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

        p {
            margin: 0;
        }
        .score {
            font-weight: 800;
            color: #86b36d;
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

            button {
                font-family: 'Roboto', Arial, sans-serif;
                font-weight: 500;
                min-width: 100px;
                font-size: 21px;
                padding: 9px 20px;
                background-color: lighten($modal-color, 10%);
                color: white;
                border: none;
                border-radius: 3px;
                box-shadow: inset 0 0 10px 3px #0003, 0 0 10px 0 #0003;

                &:hover:not(:active) {
                    background-color: lighten($modal-color, 12%);
                }
            }
        }
    }
}
</style>
