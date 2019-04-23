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
    component: LevelList
  }, {
    path: '/home',
    component: Home
  }, {
    path: '/level/:levelID',
    component: Level,
    props: route => ({
      levelID: Number(route.params.levelID)
    })
  }]
})

const app = new Vue({
  router
}).$mount('#app')