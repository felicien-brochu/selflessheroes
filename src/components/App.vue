<template>
<div class="app">
  <transition :name="transitionName"
    mode="out-in"
    @before-enter="handleTransition('onTransitionBeforeEnter', $event)"
    @enter="handleTransition('onTransitionEnter', $event)"
    @after-enter="handleTransition('onTransitionAfterEnter', $event)"
    @enter-cancelled="handleTransition('onTransitionEnterCancelled', $event)"
    @before-leave="handleTransition('onTransitionBeforeLeave', $event)"
    @leave="handleTransition('onTransitionLeave', $event)"
    @after-leave="handleTransition('onTransitionAfterLeave', $event)"
    @leave-cancelled="handleTransition('onTransitionLeaveCancelled', $event)">

    <router-view class="child-view"></router-view>
  </transition>
</div>
</template>

<script>
import './fonts/fonts.css'

export default {
  components: {},
  props: {},
  data() {
    return {
      transitionName: 'slide-left'
    }
  },
  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },

  methods: {
    handleTransition(handler, el) {
      // If there is a corresponding handler on a child, we call it
      if (el.__vue__ && el.__vue__[handler] && {}.toString.call(el.__vue__[handler]) === '[object Function]') {
        el.__vue__[handler]()
      }
    }
  }
}
</script>

<style lang="scss">
.app {}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.5s cubic-bezier(.55,0,.1,1);
}

.slide-left-enter,
.slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
}
</style>
