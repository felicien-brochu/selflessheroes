<template>
<transition name="fade"
  appear>
  <div class="score-stars-animation-level">
    <transition name="zoom"
      appear>
      <div :class="{
				'score-stars': true,
				'animated': animationRunning
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
    "score": Object,
  },

  data: function() {
    return {
      showWinStar: this.score && this.score.hasWon() && !this.score.hasToShowWon(),
      showLengthStar: this.score && this.score.hasWonLengthTarget(this.level) && !this.score.hasToShowWonLengthTarget(this.level),
      showSpeedStar: this.score && this.score.hasWonSpeedTarget(this.level) && !this.score.hasToShowWonSpeedTarget(this.level),
      animationRunning: false,
    }
  },

  mounted() {
    if (this.score) {
      this.planAnimations()
    }
  },

  beforeDestroy() {
    if (this.timeoutID >= 0) {
      clearTimeout(this.timeoutID)
      this.timeoutID = -1
    }
  },

  methods: {
    planAnimations() {
      this.timeoutID = -1
      this.step = 0
      this.steps = []

      if (this.score.hasToShowWon()) {
        this.steps.push('showWinStar')
      }
      if (this.score.hasToShowWonSpeedTarget(this.level)) {
        this.steps.push('showSpeedStar')
      }
      if (this.score.hasToShowWonLengthTarget(this.level)) {
        this.steps.push('showLengthStar')
      }

      if (this.steps.length > 0) {
        this.programAnimationStep(400)
      }
    },

    animationStep() {
      if (!this.animationRunning) {
        this.animationRunning = true
      }

      this[this.steps[this.step]] = true
      this.step++

      if (this.step < this.steps.length) {
        this.programAnimationStep(800)
      }
      else {
        this.timeoutID = setTimeout(() => this.onAnimationEnd(), 800)
      }
    },

    programAnimationStep(delay) {
      this.timeoutID = setTimeout(() => this.animationStep(), delay)
    },

    onAnimationEnd() {
      this.animationRunning = false
      this.$emit('show-score-animation-end')
    },
  }
}
</script>

<style lang="scss">
.score-stars-animation-level {
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
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.85);

        &.animated {
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
            animation-duration: 800ms;
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
                transition-delay: 30ms;
            }

            &.fade-blur-leave-to {
                filter: blur(100px);
                opacity: 0;
            }
        }

        .stars-shadow {
            background-image: url("../images/stars-shadow.png");
        }
        .left-star-enabled {
            background-image: url("../images/star-left-enabled.png");
        }
        .center-star-enabled {
            background-image: url("../images/star-center-enabled.png");
        }
        .right-star-enabled {
            background-image: url("../images/star-right-enabled.png");
        }
        .left-star-disabled {
            background-image: url("../images/star-left-disabled.png");
        }
        .center-star-disabled {
            background-image: url("../images/star-center-disabled.png");
        }
        .right-star-disabled {
            background-image: url("../images/star-right-disabled.png");
        }
    }
}
</style>
