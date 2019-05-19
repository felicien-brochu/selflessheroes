<template>
<div class="graph-container">
  <i v-show="tests.length === 0"
    class="mdi mdi-loading loader" />

  <svg class="tests-graph"
    viewBox="0 0 430 240"
    shape-rendering="optimizeSpeed">

    <template v-if="tests.length > 0">
      <template v-for="scalePoint in scale">

        <text text-anchor="end"
          x="22"
          :y="scalePoint.y + 3"
          font-family="Roboto"
          font-size="10"
          fill="#fff9">{{scalePoint.label}}</text>

        <line :key="'dash' + scalePoint.y"
          x1="27"
          :y1="scalePoint.y"
          x2="30"
          :y2="scalePoint.y"
          stroke-width="1"
          stroke="#fff2" />

        <line :key="'scaleLine' + scalePoint.y"
          x1="30"
          :x2="400 + 30"
          :y1="scalePoint.y"
          :y2="scalePoint.y"
          stroke="#fff2" />
      </template>

      <template v-for="(test, index) in tests">
        <line :key="'line' + index"
          :x1="20 * index + 30"
          :x2="20 * index + 30"
          stroke-width="1"
          y1="0"
          y2="240"
          stroke="#fff2" />

        <rect class="test-bar"
          :key="'bar' + index"
          ref="testBars"
          :x="20 * index + 3 + 30"
          y="240"
          width="14"
          height="0"
          fill="#779666" />
      </template>

      <line ref="speedTargetLine"
        :x1="30 - 3"
        y1="80"
        :x2="400 + 30"
        y2="80"
        stroke-width="1"
        stroke="#fffa" />
    </template>
  </svg>
</div>
</template>

<script>
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame

const defaultBarAnimationDuration = 180
const barAnimationFastDuration = 0
const startTargetFactor = 1.5
const supportedScales = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]
const minScaleStepHeight = 20

export default {
  props: {
    'tests': Array,
    'level': Object
  },

  data: function() {
    return {
      unitHeight: 200 / (startTargetFactor * this.level.speedTarget),
      barAnimationDuration: defaultBarAnimationDuration
    }
  },

  computed: {
    scale: function() {
      if (this.tests.length === 0) {
        return []
      }
      let scaleStep, i = 0
      do {
        scaleStep = supportedScales[i]
        i++
      }
      while (i < supportedScales.length && scaleStep * this.unitHeight < minScaleStepHeight)

      let scale = []
      for (i = 1; i * scaleStep * this.unitHeight < 200 + 40; i++) {
        let label = i * scaleStep * this.unitHeight < 220 ? i * scaleStep : ''
        scale.push({
          y: Math.round(200 - i * scaleStep * this.unitHeight + 40),
          label: label
        })
      }

      return scale
    }
  },

  watch: {
    tests: function(tests, oldTests) {
      if (tests.length > 0 && oldTests.length === 0) {
        this.$nextTick(this.startTestsAnimation)
      }
    }
  },

  methods: {
    startTestsAnimation() {
      const startHeight = startTargetFactor * this.level.speedTarget
      this.barAnimationContext = {
        start: null,
        index: 0,
        stepHeight: startHeight,
        lastStepHeight: startHeight
      }

      requestAnimationFrame(this.testAnimationStep);
    },

    testAnimationStep(timestamp) {
      let ctx = this.barAnimationContext
      if (ctx.index >= this.tests.length) {
        this.animationEnded()
        return
      }

      if (ctx.start === null) {
        ctx.start = timestamp
      }
      let progress = (timestamp - ctx.start) / (this.barAnimationDuration * Math.min(this.tests[ctx.index].steps / ctx.lastStepHeight, 1))
      let currentHeight = this.tests[ctx.index].steps * progress
      if (progress >= 1) {
        currentHeight = this.tests[ctx.index].steps * 1
        ctx.index++
        ctx.start = null
        ctx.lastStepHeight = ctx.stepHeight
        progress = 0
      }

      if (currentHeight > ctx.stepHeight) {
        ctx.stepHeight = currentHeight
        this.unitHeight = 200 / ctx.stepHeight
      }
      for (let i = 0; i < this.$refs.testBars.length && i <= ctx.index; i++) {
        let r = 1
        let test = this.tests[i]
        let stepHeight = test.steps * r
        let barEl = this.$refs.testBars[i]
        if (i === ctx.index) {
          r = progress
          stepHeight = test.steps * r
        }
        let height = (stepHeight / ctx.stepHeight) * 200
        barEl.setAttribute("height", height + 4)
        barEl.setAttribute("y", 200 - height + 40)

        if (test.hasLost && i < ctx.index) {
          barEl.setAttribute("fill", "#af3636")
        }
        else if (stepHeight > 0.5 * this.level.maxStep) {
          barEl.setAttribute("fill", "#b46f37")
        }
      }
      let targetY = (1 - (this.level.speedTarget / ctx.stepHeight)) * 200
      const targetLine = this.$refs.speedTargetLine
      targetLine.setAttribute("y1", targetY + 40)
      targetLine.setAttribute("y2", targetY + 40)


      requestAnimationFrame(this.testAnimationStep)
    },

    speedUpTestAnimation() {
      if (this.barAnimationDuration > 1) {
        this.barAnimationDuration = 1
      }
      else {
        this.finishTestAnimation()
      }
    },

    finishTestAnimation() {
      if (this.tests.length === 0) {
        return
      }
      let ctx = this.barAnimationContext
      ctx.start = 0
      ctx.index = this.tests.length

      let maxStep = this.tests.reduce((accumulator, test) => {
        return Math.max(Number.isInteger(accumulator) ? accumulator : accumulator.steps, test.steps)
      })
      maxStep = Math.max(maxStep, ctx.stepHeight)
      ctx.stepHeight = maxStep
      this.unitHeight = 200 / maxStep

      for (let i = 0; i < this.tests.length; i++) {
        let test = this.tests[i]
        let stepHeight = test.steps
        let barEl = this.$refs.testBars[i]
        let height = (stepHeight / maxStep) * 200
        barEl.setAttribute("height", height + 4)
        barEl.setAttribute("y", 200 - height + 40)

        if (test.hasLost) {
          barEl.setAttribute("fill", "#af3636")
        }
        else if (stepHeight > 0.5 * this.level.maxStep) {
          barEl.setAttribute("fill", "#b46f37")
        }
      }
      let targetY = (1 - (this.level.speedTarget / maxStep)) * 200
      const targetLine = this.$refs.speedTargetLine
      targetLine.setAttribute("y1", targetY + 40)
      targetLine.setAttribute("y2", targetY + 40)

      this.animationEnded()
    },

    animationEnded() {
      this.$emit('animation-end')
    }
  }
}
</script>

<style lang="scss">
.graph-container {
    position: relative;
    .loader {
        position: absolute;
        color: white;
        top: 50%;
        left: 50%;
        font-size: 60px;
        transform: translate(-50%, -50%);
        &::before {
            animation: spin 1s cubic-bezier(.55,.21,.56,.82) infinite;
            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        }
    }
    .tests-graph {
        width: 430px;
        background: #2f333d;
        border-radius: 8px;
        box-shadow: inset 0 0 20px 0 #252930b3;
    }
}
</style>
