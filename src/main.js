import Vue from 'vue'
import Home from './components/home/Home'
import LevelList from './components/levellist/LevelList'
import Level from './components/level/Level'
import ScreenSizeWarning from './components/screensizewarning/ScreenSizeWarning'
import App from './components/App'
import lang from './lang'
import VueRouter from 'vue-router'
import VueHotkey from 'v-hotkey'
import VueMeta from 'vue-meta'

import TextFitDirective from './components/util/TextFitDirective'
import BBCodeDirective from './components/util/BBCodeDirective'
import ScreenDimension from './components/util/ScreenDimension'

Vue.directive('text-fit', TextFitDirective)
Vue.directive('bbcode', BBCodeDirective)
Vue.use(VueHotkey)
Vue.use(VueMeta)
Vue.use(VueRouter)
Vue.prototype.$text = lang.text.bind(lang)

const router = new VueRouter({
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

const app = new Vue({
  router
}).$mount('#app-container')




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