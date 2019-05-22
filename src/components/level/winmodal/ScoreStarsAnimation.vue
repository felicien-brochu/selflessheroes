<template>
<transition name="fade"
  appear>
  <div class="score-stars-animation">
    <transition name="zoom"
      appear>
      <div :class="{
				'score-stars': true,
				'zoomed': animationRunning
			}">
        <div class="stars-shadow" />

        <transition name="appear-delay"
          appear>
          <div class="left-star-enabled"
            v-show="showSpeedStar" />
        </transition>

        <transition name="fade-blur">
          <div class="left-star-disabled"
            v-show="!showSpeedStar" />
        </transition>

        <transition name="appear-delay"
          appear>
          <div class="right-star-enabled"
            v-show="showLengthStar" />
        </transition>

        <transition name="fade-blur">
          <div class="right-star-disabled"
            v-show="!showLengthStar" />
        </transition>

        <transition name="appear-delay"
          appear>
          <div class="center-star-enabled"
            v-show="showWinStar" />
        </transition>

        <transition name="fade-blur">
          <div class="center-star-disabled"
            v-show="!showWinStar" />
        </transition>

      </div>
    </transition>
  </div>
</transition>
</template>

<script>
export default {
  components: {},
  props: {
    "level": Object,
    "hasWon": Boolean,
    "codeLength": Number,
    "averageStep": Number
  },

  data: function() {
    return {
      showLengthStar: false,
      showSpeedStar: false,
      showWinStar: false,
      animationRunning: false
    }
  },

  computed: {
    hasSpeed: function() {
      return this.averageStep >= 0 && this.averageStep <= this.level.speedTarget
    },

    hasLength: function() {
      return this.codeLength >= 0 && this.codeLength <= this.level.lengthTarget
    }
  },

  mounted() {
    this.timeoutID = -1
    this.step = 0
    this.steps = ['showWinStar']
    if (this.hasSpeed) {
      this.steps.push('showSpeedStar')
    }
    if (this.hasLength) {
      this.steps.push('showLengthStar')
    }

    this.programAnimationStep(200)
  },

  beforeDestroy() {
    if (this.timeoutID >= 0) {
      clearTimeout(this.timeoutID)
      this.timeoutID = -1
    }
    this.stopCelebration()
  },

  methods: {
    animationStep() {
      if (!this.animationRunning) {
        this.animationRunning = true
      }

      this[this.steps[this.step]] = true
      this.playCelebration()
      this.step++

      if (this.step < this.steps.length) {
        this.programAnimationStep(1500)
      }
      else {
        this.timeoutID = setTimeout(() => this.animationRunning = false, 1500)
      }
    },

    programAnimationStep(delay) {
      this.timeoutID = setTimeout(() => this.animationStep(), delay)
    },

    playCelebration() {
      this.$gameScene.playCelebration(1)
    },

    stopCelebration() {
      this.$gameScene.stopCelebration()
    },

    playCelebrations() {
      if (this.hasWon) {
        let celebrations = 1

        if (this.averageStep <= this.level.speedTarget) {
          celebrations++
        }
        if (this.codeLength <= this.level.lengthTarget) {
          celebrations++
        }
        this.playCelebration(celebrations)
      }
    },
  }
}
</script>

<style lang="scss">
.score-stars-animation {
    position: relative;

    &.fade-enter-active {
        transition: opacity 200ms ease;
        transition-delay: 100ms;
    }

    &.fade-leave-active {
        transition: none;
    }

    &.fade-enter,
    &.fade-leave-to {
        opacity: 0;
    }

    .score-stars {
        position: absolute;
        width: 65%;
        height: 65%;
        top: calc(50% - 20px);
        left: calc(50% + 10px);
        transform: translate(-50%, -50%) scale(0.85);

        &.zoomed {
            @keyframes bounce {
                0% {
                    transform: translate(-50%, -50%) scale(0.85);
                }
                12% {
                    transform: translate(-50%, -50%) scale(1);
                }
                23% {
                    transform: translate(-50%, -50%) scale(1.01);
                }
                33% {
                    transform: translate(-50%, -50%) scale(1);
                }
                80% {
                    transform: translate(-50%, -50%) scale(0.85);
                }
                to {
                    transform: translate(-50%, -50%) scale(0.85);
                }
            }
            animation-name: bounce;
            animation-iteration-count: 3;
            animation-duration: 1500ms;
            animation-timing-function: ease;
        }

        & > div {
            width: 100%;
            height: 100%;
            background-size: 100%;
            background-repeat: no-repeat;
            position: absolute;
            top: 0;
            left: 0;

            &.appear-delay-enter-active {
                transition: opacity 0s;
                transition-delay: 10ms;
            }

            &.appear-delay-enter {
                opacity: 0;
            }

            &.fade-blur-leave-active {
                transition: all 0.3s ease-in;
                transition-delay: 10ms;
            }

            &.fade-blur-leave-to {
                filter: blur(100px);
                opacity: 0;
            }
        }

        .stars-shadow {
            background-image: url("../../images/stars-shadow.png");
        }
        .left-star-enabled {
            background-image: url("../../images/star-left-enabled.png");
        }
        .center-star-enabled {
            background-image: url("../../images/star-center-enabled.png");
        }
        .right-star-enabled {
            background-image: url("../../images/star-right-enabled.png");
        }
        .left-star-disabled {
            background-image: url("../../images/star-left-disabled.png");
        }
        .center-star-disabled {
            background-image: url("../../images/star-center-disabled.png");
        }
        .right-star-disabled {
            background-image: url("../../images/star-right-disabled.png");
        }
    }
}
</style>
