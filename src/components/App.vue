<template>
<div class="app">
  <modal-layer ref="modalLayer" />

  <button class="back-button mdi mdi-chevron-left"
    type="button"
    :title="$text('level_list_back_button')"
    @mousedown="goBack"
    @touchstart="$event.preventDefault(); goBack()" />

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
import isElectron from 'is-electron'
import ModalLayer from './modal/ModalLayer'
import Modal from './modal/Modal'

export default {
  components: {
    ModalLayer
  },

  props: {},

  data() {
    return {
      transitionName: 'slide-left'
    }
  },
  beforeRouteEnter(to, from, next) {
    next()
  },
  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },

  mounted() {
    this.proposeFullscreen()
  },

  methods: {
    handleTransition(handler, el) {
      // If there is a corresponding handler on a child, we call it
      if (el.__vue__ && el.__vue__[handler] && {}.toString.call(el.__vue__[handler]) === '[object Function]') {
        el.__vue__[handler]()
      }
    },

    goBack() {
      if (this.$route.name === 'level-list') {
        this.$router.push({
          name: 'home'
        })
      }
      else if (this.$route.name === 'level') {
        this.$router.push({
          name: 'level-list',
          params: {
            careerID: this.$route.params.careerID
          }
        })
      }
    },

    proposeFullscreen() {
      if (!document.fullscreenElement && document.body.requestFullscreen && !isElectron()) {
        this.$refs.modalLayer.addModal({
          component: Modal,
          key: 'app_fullscreen_modal',
          props: {
            text: this.$text('app_fullscreen_modal'),
            cancelable: true,
            type: 'info'
          },
          handlers: {
            confirm: () => {
              document.body.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.app {
    .child-view {
        position: fixed;
        height: 100vh;
        width: 100vw;
    }

    .back-button {
        color: transparentize(white, 0.2);
        padding: 0;
        font-size: 60px;
        line-height: 40px;
        left: 4px;
        top: 12px;
        z-index: 5;
        background: none;
        border: none;
        outline: none;
        pointer-events: all;
        position: absolute;
        cursor: pointer;

        &:hover {
            color: white;
        }
    }
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition: all 0.5s cubic-bezier(.55, 0, .1, 1);
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
<style lang="scss" src="./main.scss"></style>
<style lang="css" src="./fonts/fonts.css"/>
<style lang="css" src="@mdi/font/css/materialdesignicons.css"/>
