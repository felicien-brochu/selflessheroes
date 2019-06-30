<template>
<div class="tutorial"
  v-show="started && !ended"
  @mousedown="handleOutsideClick"
  @touchstart="handleOutsideClick">

  <tutorial-modal v-if="step"
    ref="modal"
    :key="stepIndex"
    :text="$text(step.textTemplate)"
    :anchor="step.anchor"
    @next="nextStep" />

</div>
</template>

<script>
import TutorialConfig from './TutorialConfig'
import TutorialModal from './TutorialModal'

export default {
  components: {
    TutorialModal
  },

  props: {
    config: TutorialConfig
  },

  data: function() {
    return {
      modal: null,
      step: null,
      stepIndex: -1,
      width: window.innerWidth,
      height: window.innerHeight
    }
  },

  computed: {
    started: function() {
      return this.stepIndex >= 0
    },
    ended: function() {
      return this.stepIndex >= this.config.getLength()
    }
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {

    start() {
      this.stepIndex = -1
      this.$nextTick(() => {
        this.nextStep()
      })
    },

    nextStep() {
      this.stepIndex++

      if (!this.ended) {
        this.step = this.config.getStep(this.stepIndex)
      }
      else {
        this.step = null
      }

      if (this.ended) {
        this.$emit('end')
      }
    },

    handleOutsideClick(e) {
      let target = e.touches && e.touches[0].target || e.target
      e.stopPropagation()
      if (target === this.$el) {
        this.nextStep()
      }
    },

    handleWindowResize() {
      if (this.$refs.modal) {
        this.$refs.modal.updateStyle()
      }
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
  }
}
</script>

<style lang="scss">
.tutorial {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 200;

    .tutorial-modal {
        position: absolute;
    }
}
</style>
