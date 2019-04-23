import './components/main.scss'
import Vue from 'vue'
import Home from './components/Home'
import LevelList from './components/LevelList'
import Level from './components/Level'
import VueRouter from 'vue-router'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    component: Home
  }, {
    path: '/c/:careerID',
    component: LevelList,
    props: route => ({
      careerID: Number(route.params.careerID)
    })
  }, {
    path: '/c/:careerID/level/:levelID',
    component: Level,
    props: route => ({
      careerID: Number(route.params.careerID),
      levelID: Number(route.params.levelID)
    })
  }]
})

const app = new Vue({
  router
}).$mount('#app')




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