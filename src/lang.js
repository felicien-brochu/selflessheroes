import idiom from 'idiom.js'

const lang = idiom({
  'default': {
    'run_label': '⯈',

    'welcome': 'Welcome to AI World',
    'game_over': 'Game Over'
  },
  'fr': {
    'run_label': '⯈',

    'welcome': 'Bienvenue dans AI World',
    'game_over': 'Game Over'
  }
})

export default lang(window.navigator.language)