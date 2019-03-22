import idiom from 'idiom.js'

const lang = idiom({
  'default': {
    'welcome': 'Welcome to AI World'
  },
  'fr': {
    'welcome': 'Bienvenue dans AI World'
  }
})

export default lang(window.navigator.language)