<template>
<div class="app">
  <modal-layer ref="modalLayer" />

  <div class="app-buttons">

    <button class="back-button mdi mdi-chevron-left"
      v-if="showBackButton"
      type="button"
      :title="backButtonTitle"
      @mousedown="goBack"
      @touchstart="$event.preventDefault(); goBack()" />

    <button class="exit-button mdi mdi-power"
      v-else-if="hasExitButton"
      type="button"
      :title="$text('navigation_exit_button')"
      @mousedown="exitApp"
      @touchstart="$event.preventDefault(); exitApp()" />

    <button class="menu-button mdi mdi-menu-open"
      type="button"
      :title="$text('navigation_menu_button')"
      @mousedown="openMenu"
      @touchstart="$event.preventDefault(); openMenu()" />

  </div>

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
import mainStorage from '../game/storage/Storage'
import ModalLayer from './modal/ModalLayer'
import Modal from './modal/Modal'
import MenuModal from './menu/MenuModal'

export default {
  components: {
    ModalLayer
  },

  props: {},

  data() {
    return {
      transitionName: 'slide-left',
      transitioning: false
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

  computed: {
    showBackButton: function() {
      return this.$route.name !== 'home'
    },

    backButtonTitle: function() {
      if (this.$route.name === 'level-list') {
        return this.$text('level_list_back_button')
      }
      else if (this.$route.name === 'level') {
        return this.$text('level_back_button')
      }
    },

    hasExitButton: function() {
      return isElectron()
    }
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

      if (
        handler === 'onTransitionEnter' ||
        handler === 'onTransitionBeforeEnter' ||
        handler === 'onTransitionAfterEnter'
      ) {
        this.transitioning = true
      }
      else if (
        handler === 'onTransitionLeave' ||
        handler === 'onTransitionEnterCancelled' ||
        handler === 'onTransitionBeforeLeave' ||
        handler === 'onTransitionLeave' ||
        handler === 'onTransitionAfterLeave' ||
        handler === 'onTransitionLeaveCancelled'
      ) {
        this.transitioning = false
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

    exitApp() {
      if (isElectron()) {
        window.close()
      }
    },

    openMenu() {
      this.$refs.modalLayer.addModal({
        component: MenuModal,
        key: 'app_menu_modal',
        props: {
          preferences: mainStorage.preferences
        },
        handlers: {
          close: () => {
            mainStorage.save()
          }
        }
      })
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

    .app-buttons {
        position: absolute;
        z-index: 5;
        left: 4px;
        top: 12px;
        height: 44px;
        display: flex;

        button {
            background: none;
            border: none;
            outline: none;
            pointer-events: all;
            cursor: pointer;
            font-size: 44px;
            line-height: 40px;
            color: transparentize(white, 0.2);
            padding: 0;

            &:hover {
                color: white;
            }

            &.back-button {
                font-size: 60px;
            }

            &.exit-button {
                color: transparentize(white, 0.5);
                padding: 2px 4px 0 12px;

                &:hover {
                    color: transparentize(white, 0.3);
                }
            }

            &.menu-button {
                margin-left: 8px;
            }
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
