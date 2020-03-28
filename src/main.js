import Vue from 'vue'
import Home from './components/home/Home'
import LevelList from './components/levellist/LevelList'
import Level from './components/level/Level'
import ScreenSizeWarning from './components/screensizewarning/ScreenSizeWarning'
import App from './components/App'
import storage from './game/storage/Storage'
import {
  soundManager,
  musicManager
} from './components/audio/AudioManager'
import lang from './locale/lang'
import VueRouter from 'vue-router'
import VueHotkey from 'v-hotkey'
import VueMeta from 'vue-meta'

import TextFitDirective from './components/util/TextFitDirective'
import BBCodeDirective from './components/util/BBCodeDirective'
import SVGIdDirective from './components/util/SVGIdDirective'
import ScreenDimension from './components/util/ScreenDimension'

Vue.directive('text-fit', TextFitDirective)
Vue.directive('bbcode', BBCodeDirective)
Vue.directive('svgid', SVGIdDirective)
Vue.use(VueHotkey)
Vue.use(VueMeta)
Vue.use(VueRouter)

lang.applyLanguagePreference(storage.preferences.language)
Vue.prototype.$lang = lang
Vue.prototype.$text = lang.text.bind(lang)

soundManager.init()
musicManager.init()
Vue.prototype.$sound = soundManager
Vue.prototype.$music = musicManager


const router = new VueRouter({
  mode: IS_ELECTRON ? 'hash' : 'history',
  routes: [{
    path: '/',
    component: App,
    children: [{
      path: '',
      component: Home,
      name: 'home'
    }, {
      path: 'c/:careerID',
      component: LevelList,
      name: 'level-list',
      props: route => ({
        careerID: Number(route.params.careerID)
      })
    }, {
      path: 'c/:careerID/level/:levelID',
      component: Level,
      name: 'level',
      props: route => ({
        careerID: Number(route.params.careerID),
        levelID: Number(route.params.levelID)
      })
    }, {
      path: 'sizewarning',
      component: ScreenSizeWarning,
      name: 'screen-size-warning'
    }, {
      path: '*',
      redirect: {
        name: 'home',
        replace: true,
      }
    }]
  }],
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'screen-size-warning' && ScreenDimension.isTooSmall()) {
    next({
      name: 'screen-size-warning',
      replace: true,
    })
  } else {
    next()
  }
})

router.visitedRoutes = []
router.afterEach((to, from) => {
  if (to.name && !router.visitedRoutes.includes(to.name)) {
    router.visitedRoutes.push(to.name)
  }
})

const app = new Vue({
  router
}).$mount('#app-container')




if (IS_ELECTRON) {
  require('electron').ipcRenderer.on('load-career-file', (evt, careerJson) => {
    app.$children[0].loadSavedCareerExtFile(careerJson)
  })
}


if (!storageAvailable('localStorage')) {
  throw new Error('local storage unavailable')
}

function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

// 100vh fix for mobile devices
function updateVHCssProperty() {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('resize', updateVHCssProperty)
window.addEventListener('orientationchange', () => {
  setTimeout(updateVHCssProperty, 200)
})
updateVHCssProperty()