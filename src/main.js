import Vue from 'vue'
import App from './App.vue'
import ResSplitPane from 'vue-resize-split-pane'

Vue.component('rs-panes', ResSplitPane)

new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  }
})