<template>
<div :class="{
		'app': true,
		'transitioning': transitioning
	}"
  :key="componentKey">
  <modal-layer ref="modalLayer" />

  <div class="app-buttons">

    <transition name="delay"
      appear>
      <button class="back-button mdi mdi-chevron-left"
        key="back-button"
        v-if="showBackButton"
        type="button"
        :title="backButtonTitle"
        @mousedown="goBack"
        @touchstart.prevent="goBack" />
    </transition>

    <transition name="delay"
      appear>
      <button class="exit-button mdi mdi-power"
        key="exit-button"
        v-if="showExitButton"
        type="button"
        :title="$text('navigation_exit_button')"
        @mousedown="exitApp"
        @touchstart.prevent="exitApp" />
    </transition>

    <button class="menu-button mdi mdi-menu-open"
      v-if="showMenuButton"
      type="button"
      :title="$text('navigation_menu_button')"
      @mousedown="openMenu"
      @touchstart.prevent="openMenu" />

  </div>

  <div class="community-buttons"
    v-if="showCommunityButtons">

    <transition name="delay-appear"
      appear>
      <button v-if="showPremiumButton"
        type="button"
        class="premium-button"
        :title="$text('navigation_premium_button')"
        @click.prevent.stop="showPremiumModal">{{$text('navigation_premium_button')}}</button>
    </transition>

    <transition name="delay-appear"
      appear>
      <a class="discord-button mdi mdi-discord"
        :href="discordURL"
        :title="$text('navigation_discord_button')"
        @click="goToDiscord"
        target="_blank"></a>
    </transition>

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

    <router-view class="child-view"
      ref="routerView"></router-view>
  </transition>

</div>
</template>

<script>
import Vue from 'vue'
import storage from '../game/storage/Storage'
import ModalLayer from './modal/ModalLayer'
import Modal from './modal/Modal'
import MenuModal from './menu/MenuModal'
import PremiumModal from './premium/PremiumModal'
import UnlockPremiumModal from './premium/UnlockPremiumModal'
import ProposeFullscreenModal from './menu/ProposeFullscreenModal'
import WarnLocalStorageModal from './menu/WarnLocalStorageModal'
import lang from '../locale/lang'
const $text = lang.text.bind(lang)

export default {
  metaInfo: {
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? $text('head_title_template', {
        title: titleChunk
      }) : $text('head_title')
    },
    htmlAttrs: {
      lang: lang.currentLanguage,
    },
    // noscript: [{
    //   innerHTML: `
    // 		<header></header>
    // 		<div class="noscript-text">${$text('noscript_message')}</div>
    // 		`
    // }],
    meta: [{
      vmid: "og:title",
      property: "og:title",
      content: $text('head_meta_og_title'),
    }, {
      vmid: "og:description",
      property: "og:description",
      content: $text('head_meta_og_description'),
    }, {
      vmid: "keywords",
      name: "keywords",
      content: $text('head_meta_keywords'),
    }, {
      vmid: "description",
      name: "description",
      content: $text('head_meta_description'),
    }]
  },

  components: {
    ModalLayer
  },

  props: {},

  data() {
    return {
      componentKey: 0,
      transitionName: 'slide-left',
      transitioning: false,
      requestFullscreenHasFailed: false,
    }
  },

  created() {
    this.$sound.setVolumePreference(storage.preferences.soundVolume)
    this.$music.setVolumePreference(storage.preferences.musicVolume)
  },

  beforeRouteUpdate(to, from, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },

  computed: {
    showBackButton: function() {
      return this.$route.name !== 'home' && this.$route.name !== 'screen-size-warning'
    },

    backButtonTitle: function() {
      if (this.$route.name === 'level-list') {
        return this.$text('level_list_back_button')
      }
      else if (this.$route.name === 'level' || this.$route.name === 'local-level') {
        return this.$text('level_back_button')
      }
    },

    showExitButton: function() {
      return IS_ELECTRON && (this.$route.name === 'home' || this.$route.name === 'screen-size-warning')
    },

    showMenuButton: function() {
      return this.$route.name !== 'screen-size-warning'
    },

    showPremiumButton: function() {
      return !storage.isPremium
    },

    showCommunityButtons: function() {
      return this.$route.name === 'home' || this.$route.name === 'level-list'
    },

    discordURL: function() {
      return DISCORD_URL
    }
  },

  mounted() {
    if (this.$route.name !== 'screen-size-warning') {
      let res = this.warnLocalStorage()
      if (!res) {
        this.proposeFullscreen()
      }
    }

    Vue.prototype.$appRef = this
  },

  methods: {
    handleTransition(handler, el) {
      // // If there is a corresponding handler on a child, we call it
      // if (el.__vue__ && el.__vue__[handler] && {}.toString.call(el.__vue__[handler]) === '[object Function]') {
      //   el.__vue__[handler]()
      // }
      //
      // if (
      //   handler === 'onTransitionEnter' ||
      //   handler === 'onTransitionBeforeEnter' ||
      //   handler === 'onTransitionAfterEnter'
      // ) {
      //   this.transitioning = false
      // }
      // else if (
      //   handler === 'onTransitionLeave' ||
      //   handler === 'onTransitionEnterCancelled' ||
      //   handler === 'onTransitionBeforeLeave' ||
      //   handler === 'onTransitionLeave' ||
      //   handler === 'onTransitionAfterLeave' ||
      //   handler === 'onTransitionLeaveCancelled'
      // ) {
      //   this.transitioning = true
      // }
    },

    goBack() {
      if (this.$route.name === 'level-list' || this.$route.name === 'local-level') {
        if (this.$router.visitedRoutes.includes('home')) {
          this.$router.back()
        }
        else {
          this.$router.replace({
            name: 'home'
          })
        }
      }
      else if (this.$route.name === 'level') {
        if (this.$router.visitedRoutes.includes('level-list')) {
          this.$router.back()
        }
        else {
          this.$router.replace({
            name: 'level-list',
            params: {
              careerID: this.$route.params.careerID
            }
          })
        }
      }
    },

    exitApp() {
      if (IS_ELECTRON) {
        this.$refs.modalLayer.addModal({
          component: Modal,
          key: 'exit-warning-modal',
          props: {
            text: this.$text('app_exit_warning_modal'),
            type: 'info',
            cancelable: true,
            confirmLabel: this.$text('modal_confirm_yes'),
            cancelLabel: this.$text('modal_cancel_no')
          },
          handlers: {
            confirm: () => window.close(),
          }
        })
      }
    },

    openMenu() {
      this.$refs.modalLayer.addModal({
        component: MenuModal,
        key: 'app_menu_modal',
        props: {
          preferences: storage.preferences
        },
        handlers: {
          close: () => {
            storage.save()
          },
          'preference-change': (changedPref) => {
            storage.save()

            if (changedPref === 'language') {
              this.$lang.applyLanguagePreference(storage.preferences.language)
              // Force rerender the entire app
              this.componentKey++
            }
          }
        }
      })
    },

    showPremiumModal() {
      this.$refs.modalLayer.addModal({
        component: PremiumModal,
        key: 'premium_modal',
        props: {},
        handlers: {
          confirm: this.showUnlockPremiumModal
        }
      })
    },

    showUnlockPremiumModal() {
      this.$refs.modalLayer.addModal({
        component: UnlockPremiumModal,
        key: 'unlock_premium_modal',
        props: {},
        handlers: {
          confirm: this.showPremiumActivatedModal
        }
      })
    },

    showPremiumActivatedModal() {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'premium_activated_modal',
        props: {
          type: 'info',
          cancelable: false,
          text: this.$text('premium_activated_modal'),
        },
        handlers: {
          // Reload page to show unlocked levels
          close: () => window.location.reload()
        }
      })
    },

    loadSavedCareerFile(file) {
      let reader = new FileReader()

      reader.onload = e => {
        let json = e.target.result
        this.loadSavedCareer(json)
      }
      reader.readAsText(file, "UTF-8")
    },

    loadSavedCareerExtFile(careerJson) {
      this.loadSavedCareer(careerJson)
    },

    loadSavedCareer(json) {
      try {
        let career = storage.loadSavedCareer(json)

        if (career) {
          if (this.$route.name !== 'home') {
            this.$router.replace({
              name: 'home'
            }, () => {
              this.$router.push({
                name: 'level-list',
                params: {
                  careerID: career.id
                }
              })
            })
          }
          else {
            this.$router.push({
              name: 'level-list',
              params: {
                careerID: career.id
              }
            })
          }
        }
      }
      catch (ex) {
        console.error("Error while loading saved game from .shsv file", ex)
        this.showWrongCareerFileFormatModal()
      }
    },

    showWrongCareerFileFormatModal() {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'load-saved-career-error',
        props: {
          text: this.$text('home_wrong_file_format_error'),
          cancelable: false
        }
      })
    },

    loadLevelFile(levelJson) {
      try {
        let level = storage.loadLocalLevel(levelJson)

        if (level) {
          if (this.$route.name !== 'home') {
            this.$router.replace({
              name: 'home'
            }, () => {
              this.$router.push({
                name: 'local-level'
              })
            })
          }
          else {
            this.$router.push({
              name: 'local-level'
            })
          }
        }
      }
      catch (ex) {
        console.error("Error while loading local level from .shlv file", ex)
        this.showLocalLevelLoadingErrorModal(ex)
      }
    },

    showLocalLevelLoadingErrorModal(ex) {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'load-local-level-error',
        props: {
          text: this.$text('home_local_level_loading_error'),
          cancelable: false
        }
      })
    },

    goToDiscord(e) {
      if (IS_ELECTRON) {
        e.preventDefault()
        require('electron').ipcRenderer.send('open-link', this.discordURL)
      }
    },

    warnLocalStorage() {
      if (!IS_ELECTRON && this.$route.name === 'home' && storage.preferences.warnLocalStorage) {
        this.$refs.modalLayer.addModal({
          component: WarnLocalStorageModal,
          key: 'app_warn_local_storage_modal',
          props: {
            preferences: storage.preferences
          },
          handlers: {
            close: () => {
              storage.save()
              this.proposeFullscreen()
            },
          }
        })
        return true
      }
      return false
    },

    proposeFullscreen() {
      if (!document.fullscreenElement && document.body.requestFullscreen && !IS_ELECTRON && storage.preferences.proposeFullscreen) {
        this.$refs.modalLayer.addModal({
          component: ProposeFullscreenModal,
          key: 'app_fullscreen_modal',
          props: {
            preferences: storage.preferences
          },
          handlers: {
            close: () => {
              storage.save()
            },
            confirm: () => {
              document.body.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
                if (!this.requestFullscreenHasFailed) {
                  this.requestFullscreenHasFailed = true
                  this.proposeFullscreen()
                }
              })
            }
          }
        })
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
.app {
    .child-view {
        position: fixed;
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
        width: 100vw;
    }

    &.transitioning .app-buttons,
    &.transitioning .community-buttons {
        opacity: 0;
    }

    .app-buttons {
        position: absolute;
        z-index: 5;
        left: 4px;
        top: 12px;
        height: 44px;
        display: flex;

        transition: opacity 0.5s ease;

        button {
            pointer-events: all;
            font-size: 44px;
            line-height: 40px;
            color: transparentize(white, 0.2);

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

    .community-buttons {
        position: absolute;
        z-index: 5;
        right: 20px;
        top: 17px;
        height: 44px;
        display: flex;

        transition: opacity 0.5s ease;

        .premium-button {
            background: #568AF2;
            padding: 0 10px;
            font-family: 'Roboto', "Noto", Arial, sans-serif;
            color: white;
            font-size: 20px;
            font-weight: 500;
            border-radius: 3px;
            box-shadow: inset 0 0 10px 3px rgba(0, 0, 0, 0.2), 0 0 10px 0 rgba(0, 0, 0, 0.2);
            height: 38px;
            margin: 0 16px;
            opacity: 0.8;

            &:hover {
                opacity: 1;
            }

            transition: opacity 0.1s ease;
        }

        a.discord-button {
            pointer-events: all;
            font-size: 44px;
            line-height: 40px;
            margin-top: 1px;
            color: transparentize(white, 0.2);

            &:hover {
                color: white;
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

.delay-enter-active,
.delay-leave-active {
    transition-timing-function: ease;
    transition-property: all;
    transition-duration: 0.2s;
    transition-delay: 0.2s;
}

.delay-appear-enter-active,
.delay-appear-leave-active {
    opacity: 0;
    transition-timing-function: ease;
    transition-property: all;
    transition-duration: 0.2s;
    transition-delay: 0.2s;
}
</style>
<style lang="scss" src="./main.scss"></style>
<style lang="css" src="./fonts/fonts.css"/>
<style lang="css" src="@mdi/font/css/materialdesignicons.css"/>
