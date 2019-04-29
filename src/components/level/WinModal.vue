<template>
<modal v-bind="$props"
  ref="modal"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <svg class="tests-graph"
    viewBox="0 0 2000 1200">


    <line v-for="(test, index) in tests"
      :key="'line' + index"
      :x1="100 * index"
      :x2="100 * index"
      y1="0"
      y2="1200"
      stroke="#FFFFFF22" />

    <rect v-for="(test, index) in tests"
      class="test-bar"
      :key="'bar' + index"
      ref="testBars"
      :x="100 * index"
      y="1200"
      width="100"
      height="0"
      rx="0"
      ry="0"
      fill="#779666" />

    <line stroke-dasharray="4, 3"
      ref="speedTargetLine"
      x1="0"
      y1="500"
      x2="2000"
      y2="500"
      stroke="black" />
  </svg>
</modal>
</template>

<script>
import Modal from '../modal/Modal'
import WinLevelTestWorker from './WinLevelTest.worker.js';

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame

const barAnimationDuration = 400

export default {
  components: {
    Modal
  },
  props: {
    'code': String,
    'level': Object,
    'text': {
      type: String,
      default: 'no-text'
    },
    'cancelable': {
      type: Boolean,
      default: true
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
      tests: []
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
    this.worker.onerror = function(e) {
      console.error("####WORKER error", e)
    }
    this.worker.postMessage({
      levelID: this.level.id,
      code: this.code
    })
  },

  methods: {
    handleWorkerResponse(e) {
      this.tests = e.data
      this.$nextTick(this.startTestsAnimation)
      console.log("####WORKER response", e.data)
    },

    startTestsAnimation() {
      this.barAnimationContext = {
        start: null,
        index: 0,
        stepHeight: 2 * this.level.speedTarget,
        lastStepHeight: 2 * this.level.speedTarget
      }

      requestAnimationFrame(this.testAnimationStep);
    },

    testAnimationStep(timestamp) {
      let ctx = this.barAnimationContext
      if (ctx.index >= this.tests.length) {
        return
      }

      if (ctx.start === null) {
        ctx.start = timestamp
      }
      let progress = (timestamp - ctx.start) / (barAnimationDuration * Math.min(this.tests[ctx.index].steps / ctx.lastStepHeight, 1))
      let currentHeight = this.tests[ctx.index].steps * progress
      if (progress >= 1) {
        currentHeight = this.tests[ctx.index].steps * 1
        ctx.index++
        ctx.start = null
        ctx.lastStepHeight = ctx.stepHeight
        progress = 0
      }
      // console.log("CTXheight", ctx, progress, this.tests[ctx.index].steps)
      if (currentHeight > ctx.stepHeight) {
        ctx.stepHeight = currentHeight
      }
      for (let i = 0; i < this.$refs.testBars.length && i <= ctx.index; i++) {
        let r = i === ctx.index ? progress : 1
        let height = (this.tests[i].steps / ctx.stepHeight) * r * 1000
        this.$refs.testBars[i].setAttribute("height", height)
        this.$refs.testBars[i].setAttribute("y", 1000 - height + 200)
      }
      let targetY = (1 - (this.level.speedTarget / ctx.stepHeight)) * 1000
      this.$refs.speedTargetLine.setAttribute("y1", targetY + 200)
      this.$refs.speedTargetLine.setAttribute("y2", targetY + 200)
      requestAnimationFrame(this.testAnimationStep)
    },

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
.tests-graph {
    width: 520px;
    background: #472b44;
    border-radius: 5px;
}
</style>
