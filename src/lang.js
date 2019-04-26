import idiom from "idiom.js"

const lang = idiom({
  'default': {
    new_game: "new game:",
    new_game_name_placeholder: "Pseudo",
    remove_career_button: "Remove",
    remove_career_warning: "Are you really sure to delete this game?\nAll progression will be lost.",

    game_over: "Game Over",

    code_state_ok_tooltip: "Your code is ready to be run",
    code_state_not_runnable_tooltip: "Your instructions are not complete:\nclick for more details",
    code_state_not_compilable_tooltip: "There is an error in your code:\nclick for more details",
    switch_editor_warning: "There is an error in your code.\nIf you switch to graphic editor now,\nparts of it risk to be erased.",

    modal_confirm_button: "ok",
    modal_cancel_button: "cancel",
    modal_close_button: "close",
  },


  'fr': {
    new_game: "nouvelle partie\u00A0:",
    new_game_name_placeholder: "Pseudo",
    remove_career_button: "Supprimer",
    remove_career_warning: "Êtes-vous vraiment sûr de vouloir supprimer cette partie\u00A0?\nToute progression sera perdue.",

    game_over: "Game Over",

    code_state_ok_tooltip: "Votre code est prêt à être exécuté",
    code_state_not_runnable_tooltip: "Vos instructions ne sont pas complètes\u00A0:\nclique pour plus de détail",
    code_state_not_compilable_tooltip: "Votre code contient une erreur\u00A0:\nclique pour plus de détail",
    switch_editor_warning: "Votre code contient une erreur.\nSi vous passez à l'éditeur graphique,\ndes parties de votre code risquent d'être effacées.",

    modal_confirm_button: "ok",
    modal_cancel_button: "annuler",
    modal_close_button: "fermer",
  }
})

export default lang(window.navigator.language)