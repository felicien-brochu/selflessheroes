import Vue from 'vue'
import App from './App.vue'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)

new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  }
})