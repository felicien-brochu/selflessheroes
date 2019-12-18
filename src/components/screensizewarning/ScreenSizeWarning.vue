<template>
<div class="screen-size-warning">

  <header></header>

  <div class="warning-content">
    <img src="../images/screen-size-warning.png" />
    <div class="warning-text">{{$text('screen_size_warning_1')}}</div>
  </div>
  <div class="warning-explanation">{{warningExplanation}}</div>
</div>
</template>

<script>
import ScreenDimension from '../util/ScreenDimension'

export default {
  components: {},

  computed: {
    warningExplanation: function() {
      let screenDimension = ScreenDimension.get()
      let minDimension = ScreenDimension.getMinDimension()
      return this.$text('screen_size_warning_2', {
        maxDimension: screenDimension.max,
        minDimension: screenDimension.min,
        minMaxDimension: minDimension.max,
        minMinDimension: minDimension.min,
      })
    }
  },

  beforeRouteEnter(to, from, next) {
    if (!ScreenDimension.isTooSmall()) {
      next({
        name: 'home',
        replace: true,
      })
    }
    else {
      next()
    }
  },
}
</script>

<style lang="scss">
.screen-size-warning {
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    color: #ABB2BF;
    background-color: #282C34;
    overflow: auto;

    header {
        height: 40vw;
        max-height: 50vh;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url("../images/banner.jpg");
    }

    .warning-content {
        display: flex;
        margin: 0 30px;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;

        img {
            max-height: 40vh;
            max-width: 100%;
        }

        .warning-text {
            padding: 30px 20px;
            font-size: 24px;
            max-width: 300px;
        }
    }
    .warning-explanation {
        padding: 0 40px;
        margin: 30px auto;
        max-width: 600px;
    }
}
</style>
