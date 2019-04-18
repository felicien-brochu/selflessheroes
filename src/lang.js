import idiom from 'idiom.js'

const lang = idiom({
  'default': {
    welcome: 'Welcome to AI World',
    game_over: 'Game Over',

    code_state_ok_tooltip: 'Your code is ready to be run',
    code_state_not_runnable_tooltip: 'Your instructions are not complete:\nclick for more details',
    code_state_not_compilable_tooltip: 'There is an error in your code:\nclick for more details'
  },


  'fr': {
    welcome: 'Bienvenue dans AI World',
    game_over: 'Game Over',

    code_state_ok_tooltip: 'Votre code est prêt à être exécuté',
    code_state_not_runnable_tooltip: 'Vos instructions ne sont pas complètes\u00A0:\nclique pour plus de détail',
    code_state_not_compilable_tooltip: 'Votre code contient une erreur\u00A0:\nclique pour plus de détail'
  }
})

export default lang(window.navigator.language)