import format from 'string-template'

const messages = {
  default: 'en',

  'en': {
    no_text: "[no-text]",

    app_fullscreen_modal: "In order to have the best game experience,\nit is recommended to go fullscreen",
    app_fullscreen_modal_stop_propose: "Don't show this message again",
    navigation_exit_button: "Exit",
    navigation_menu_button: "Menu",
    menu_fullscreen_label: "Fullscreen:",
    menu_enable_fullscreen: "Fullscreen",
    menu_disable_fullscreen: "Exit fullscreen",
    menu_sound_label: "Sound:",
    menu_music_label: "Music:",
    mute_button_mute: "Mute",
    mute_button_unmute: "Unmute",

    screen_size_warning_1: "The screen of your device is too small to play Selfless Heroes",
    screen_size_warning_2: "Selfless Heroes is designed to work on desktop, laptop and tablet. To play this game, you must have a screen size of at least {minMaxDimension}\u00A0x\u00A0{minMinDimension} pixels: your screen is only {maxDimension}\u00A0x\u00A0{minDimension} pixels.",

    new_game: "new game:",
    new_game_name_placeholder: "Pseudo",
    save_career_button: "Save as…",
    remove_career_button: "Remove",
    remove_career_warning: "Are you really sure to delete this profile?\nAll progression will be lost.",

    level_list_back_button: "Back",
    level_list_bonus_label: "BONUS",

    level_details_edit_button: "play",
    level_details_edit_button_tooltip: "Play",
    level_details_back_button: "back",
    level_details_back_button_tooltip: "Back",
    level_details_add_solution_button: "New solution",
    level_details_duplicate_solution_button: "Duplicate",
    level_details_duplicate_solution_suffix: " copy",
    level_details_delete_solution_button: "Delete",
    level_details_rename_solution_button: "Rename",
    level_details_name_input_placeholder: "name",
    level_details_delete_solution_warning: "Are you really sure to delete this solution?",

    modal_confirm_button: "ok",
    modal_cancel_button: "cancel",
    modal_close_button: "Close",
    modal_confirm_yes: "yes",
    modal_cancel_no: "no",

    tutorial_button_next: "Next",

    tutorial_basic_step_tutorial_warning: "It is advisable to follow this tutorial carefully in order to be able to play as soon as possible.\n\nClick on the arrow to launch the tutorial.",
    tutorial_basic_step_graphcode: "The heroes follow these instructions step by step",
    tutorial_basic_step_palette: "Drag new instructions from here to change heroes behavior",
    tutorial_basic_step_objective: "To see the level objective click here",
    tutorial_basic_step_runbar: "When your program is ready, click here to run it",
    tutorial_basic_step_help: "If you need more help or want to see this tutorial again, click here",

    tutorial_advanced_step_undo: "Undo last edit",
    tutorial_advanced_step_redo: "Redo",
    tutorial_advanced_step_delete: "Delete all instructions",
    tutorial_advanced_step_editor_switch: "Switch to code editor.\nCode editor can be used to copy a code from one level to another.\nIt is also intended to be used by advanced players who want to write their program using code instead of the graphic interface.",
    tutorial_advanced_step_game: "Select a hero by clicking on it to better follow its behaviour.\nWhile the program is running, a blue cursor will appear to the left of the instructions to show at which step of the program the selected hero is.",
    tutorial_advanced_step_play_pause: "Run or pause the program",
    tutorial_advanced_step_step: "Run the program step by step",
    tutorial_advanced_step_stop: "Stop the program",
    tutorial_advanced_step_speed: "Speed setting",
    tutorial_advanced_step_menu: "Open the menu",

    level_modal_speed_target_unit: "cycles",
    level_modal_length_target_unit: "lines",

    level_back_button: "Back to level list",
    level_help_button: "Help",
    level_objective_button: "Objective",

    level_help_modal_title: "Help",
    level_help_modal_tab_general_title: "general",
    level_help_basic_tutorial_button: "Basic tutorial",
    level_help_advanced_tutorial_button: "Advanced tutorial",

    level_help_tab_statement_code_example: "code example:",
    level_help_tab_statement_graph_code_example: "example:",

    level_help_tab_if_statement_1: "%%statement branching-statement$if%% allows to run instructions only if a given condition is true.",
    level_help_tab_if_statement_2: "You could read the above example as \"If the square to the right of me is a wall, then go to the left. Otherwise go to the right\".",
    level_help_tab_if_statement_3: "%%statement branching-statement$if%% checks if the condition is true in which case it will run the instructions inside it (instructions to the right of the vertical gray line). Otherwise it will run the instructions inside the %%statement branching-statement$else%% if there is one.",
    level_help_tab_if_statement_4: "%%statement branching-statement$else%% is not initialy part of the %%statement branching-statement$if%%. To make it appear, drag any instruction over the %%statement branching-statement$if%%.\nIf you remove all the instructions inside %%statement branching-statement$else%%, it will disappear.",
    level_help_tab_if_statement_5: "%%type-keyword$if%% %%type-literal$e%% %%type-operator$==%% %%type-literal$wall%% :\n  %%type-function$step%%(%%type-literal$w%%)\n%%type-keyword$else%%\n  %%type-function$step%%(%%type-literal$e%%)\n%%type-keyword$endif%%\n",
    level_help_tab_if_statement_6: "Click on the plus sign to add other conditions.",
    level_help_tab_if_statement_7: "You could read the above example as \"If the square to the right of me is a wall or if the square to the right of me is a hole, then go to the left\".",
    level_help_tab_if_statement_8: "%%type-keyword$if%% %%type-literal$e%% %%type-operator$==%% %%type-literal$wall%% %%type-operator$||%%\n  %%type-literal$e%% %%type-operator$==%% %%type-literal$hole%% :\n  %%type-function$step%%(%%type-literal$w%%)\n%%type-keyword$endif%%\n",

    level_help_tab_jump_statement_1: "%%statement branching-statement$jump%% allows to jump backward or forward in the program.",
    level_help_tab_jump_statement_2: "You could read the above example as \"Step to the right infinitely many times\".",
    level_help_tab_jump_statement_3: "%%type-bracket$a:%%\n%%type-function$step%%(%%type-literal$e%%)\n%%type-keyword$jump%% %%type-bracket$a%%",
    level_help_tab_jump_statement_4: "The first line creates an \"anchor\" named \"a\". The third line says to jump back to this anchor.\nYou can choose any name you want for your anchors. Each jump must match a unique anchor.",
    level_help_tab_jump_statement_5: "%%statement branching-statement$jump%% is usually used with %%statement branching-statement$if%% to create loops which stops at a condition.",
    level_help_tab_jump_statement_6: "You could read the above example as \"Step to the right as long as the square to the right is not a wall\".",
    level_help_tab_jump_statement_7: "%%type-bracket$a:%%\n%%type-function$step%%(%%type-literal$e%%)\n%%type-keyword$if%% %%type-literal$e%% %%type-operator$!=%% %%type-literal$wall%% :\n  %%type-keyword$jump%% %%type-bracket$a%%\n%%type-keyword$endif%%",

    level_help_tab_step_function_1: "%%statement action-statement$step%% says to your hero to go in a direction. If you specify multiple directions, the hero will decide randomly between these directions.",
    level_help_tab_step_function_2: "You could read the above example as \"Go one step to the left or to the right\".",
    level_help_tab_step_function_3: "%%type-function$step%%(%%type-literal$w%% %%type-literal$e%%)",

    level_help_tab_step_once_function_1: "%%statement action-statement$step%% says to your hero to go in a direction.",
    level_help_tab_step_once_function_2: "You could read the above example as \"Go one step to the right\".",
    level_help_tab_step_once_function_3: "%%type-function$step%%(%%type-literal$e%%)",

    level_help_tab_fireball_function_1: "%%statement action-statement$fireball%% throws a fireball on a square around the hero.\nIf the fireball hits another hero it will kill him. You can use a fireball to lit a %%icon icon-bonfire$%% bonfire.",
    level_help_tab_fireball_function_2: "You could read the above example as \"Throw a fireball to the right\".",
    level_help_tab_fireball_function_3: "%%type-function$fireball%%(%%type-literal$e%%)",

    level_help_tab_take_function_1: "%%statement action-statement$take%% says to your hero to take an item.",
    level_help_tab_take_function_2: "You could read the above example as \"If there is an egg on the square on your right, take this egg\".",
    level_help_tab_take_function_3: "%%type-keyword$if%% %%type-literal$e%% %%type-operator$==%% %%type-literal$egg%% :\n  %%type-function$take%%(%%type-literal$e%%)\n%%type-keyword$endif%%\n",

    level_help_tab_drop_function_1: "%%statement action-statement$drop%% says to your hero to drop his item.",
    level_help_tab_drop_function_2: "You could read the above example as \"Drop your item on the square on your right\".",
    level_help_tab_drop_function_3: "%%type-function$drop%%(%%type-literal$e%%)\n",

    level_help_tab_write_function_1: "%%statement action-statement$write%% says to your hero to write something on his item.",
    level_help_tab_write_function_2: "You could read the above example as \"Write 3 on your item\".",
    level_help_tab_write_function_3: "%%type-function$write%%(%%type-literal$3%%)\n",

    level_help_tab_set_function_1: "%%statement assign-statement$set%% initializes a variable.",
    level_help_tab_set_function_2: "You could read the above example as \"Set the variable a to 3\".",
    level_help_tab_set_function_3: "%%type-variable$$a%% %%type-operator$=%% %%type-function$set%%(%%type-literal$3%%)\n",

    level_help_tab_calc_function_1: "%%statement assign-statement$calc%% makes a calculation and puts the result in a variable.",
    level_help_tab_calc_function_2: "You could read the above example as \"Set the variable b to a + 2\".",
    level_help_tab_calc_function_3: "%%type-variable$$b%% %%type-operator$=%% %%type-function$calc%%(%%type-variable$$a%% %%type-operator$+%% %%type-literal$2%%)\n",

    level_objective_modal_objective_title: "objective",
    level_objective_modal_secondary_objectives_title: "secondary objectives",

    win_modal_prior_code_speed: "your fastest was %%score-number${minStep}%% cycles",
    win_modal_prior_code_length: "your smallest was %%score-number${minLength}%% lines",
    win_modal_ok_button: "ok",
    win_modal_continue_edit_button: "improve",

    editor_bar_undo_button: "Undo",
    editor_bar_redo_button: "Redo",
    editor_bar_delete_button: "Delete",
    editor_bar_switch_to_graph: "Switch to graphic editor",
    editor_bar_switch_to_code: "Switch to code editor",

    code_state_ok_tooltip: "Your code is ready to be run",
    code_state_not_runnable_tooltip: "Your instructions are not complete:\nclick me for more details",
    code_state_not_compilable_tooltip: "There is an error in your code:\nclick me for more details",
    code_state_ok_modal: "Your code is ready to be run",
    code_state_not_runnable_modal: "Your code contains %%undefined$undefined%% keywords.\nReplace them by correct values before running your code.",
    switch_editor_warning: "There is an error in your code.\nIf you switch to graphic editor now,\nparts of it risk to be erased.",

    code_error_position_template: "line {line}",
    errors_modal_title: "Errors",

    exception_mismatch_statement_template: "you wrote something erroneous after this {statementType}.",
    exception_mismatch_keyword_template: "you wrote something erroneous after this %%keyword${statementType}%%.",
    exception_mismatch_function_template: "you wrote something erroneous after the function %%function${keyword}()%%.",
    exception_invalid_variable_identifier_template: "%%variable${variable}%% variable name is not allowed. Use one of the following instead: %%variable${allowedIdentifiers}%%.",
    exception_invalid_value_function_template: "%%function${code}%% is not a valid function. Use one of the following instead: %%function${allowedFunctions}%%.",
    exception_forbidden_action_function_template: "%%function${keyword}()%% is not available in this level. Use one of the following instead: %%function${allowedFunctions}%%",
    exception_forbidden_value_function_template: "%%function${keyword}()%% is not available in this level. Use one of the following instead: %%function${allowedFunctions}%%",
    exception_invalid_params_one_dir_integer_variable_myitem_template: "%%function${keyword}()%% requires exactly one parameter which can be a number, a variable, a direction or %%literal$myitem%%",
    exception_invalid_dir_integer_variable_myitem_param_template: "%%variable${param}%% is not a valid number, variable, direction or %%literal$myitem%%",
    exception_invalid_params_one_integer_or_variable_template: "%%function${keyword}()%% requires exactly one parameter which can be a number or a variable",
    exception_invalid_integer_or_variable_param_template: "%%variable${param}%% is not a valid number or variable",
    exception_invalid_params_one_dir_template: "%%function${keyword}()%% requires exactly one direction parameter: %%literal${directions}%%",
    exception_invalid_params_one_more_dir_template: "%%function${keyword}()%% requires one or more direction parameters: %%literal${directions}%%",
    exception_invalid_direction_param_template: "%%variable${param}%% is not a valid direction. Use one of these : %%literal${allowedValues}%%",
    exception_invalid_params_calc_function_template: "%%function${keyword}()%% takes 3 parameters. Params 1 and 3 must be either numbers, directions, %%literal$myitem%% or variables and param 2 must be an operator (%%operator${operators}%%)",
    exception_duplicate_param_template: "you cannot pass %%literal${param}%% parameter twice to %%function${keyword}()%%",
    exception_forbidden_object_type_template: "%%literal${keyword}%% object type is not available in this level. You can use one of the following: %%literal${allowedValues}%%",
    exception_forbidden_terrain_type_template: "%%literal${keyword}%% terrain type is not available in this level. You can use one of the following: %%literal${allowedValues}%%",
    exception_boolean_no_comparison_operator_template: "a condition must contain a valid comparator like these: %%operator${allowedOperators}%%",
    exception_invalid_expression_template: "%%variable${code}%% is not a valid keyword",
    exception_invalid_statement_template: "%%variable${code}%% is not a valid instruction",
    exception_forbidden_variable_identifier_template: "%%variable${variable}%% variable is unavailable in this level. Use one of the following: %%variable${allowedNames}%%",
    exception_all_forbidden_variable_identifier_template: "variables are not available in this level",

    exception_open_statement_template: "%%keyword${keyword}%% condition must be closed with a %%code$:%%",
    exception_else_no_if_template: "%%keyword${elseKeyword}%% without %%keyword${ifKeyword}%% before",
    exception_endif_no_if_template: "%%keyword${endifKeyword}%% without %%keyword${ifKeyword}%% before",
    exception_if_no_endif_template: "%%keyword${ifKeyword}%% without %%keyword${endifKeyword}%%",
    exception_duplicate_anchor_template: "%%bracket${anchorName}:%% found twice. Anchors must have unique names",
    exception_jump_to_unknown_anchor_template: "%%keyword${jumpKeyword}%% to unknown anchor %%bracket${anchorName}:%%",

    type_anchor: "anchor",
    type_assign: "assignment",
    type_else: "else",
    type_empty: "void",
    type_endif: "endif",
    type_if: "if",
    type_jump: "jump",
    type_direction: "direction",

    function_step: "step",
    function_fireball: "fireball",
    function_set: "set",
    function_calc: "calc",
    function_take: "take",
    function_drop: "drop",
    function_write: "write",

    graph_node_if: "if",
    graph_node_else: "else",
    graph_node_jump: "jump",

    graph_node_function_step: "step",
    graph_node_function_fireball: "fireball",
    graph_node_function_set: "set",
    graph_node_function_calc: "calc",
    graph_node_function_take: "take",
    graph_node_function_drop: "drop",
    graph_node_function_write: "write",

    operator_comparison_eq: "=",
    operator_comparison_ne: "≠",
    operator_comparison_le: "≤",
    operator_comparison_lt: "<",
    operator_comparison_ge: "≥",
    operator_comparison_gt: ">",

    operator_boolean_and: "and",
    operator_boolean_or: "or",
    operator_boolean_delete: "delete",

    operator_arithmetic_plus: "+",
    operator_arithmetic_minus: "−",
    operator_arithmetic_multiply: "×",
    operator_arithmetic_divide: "÷",
    operator_arithmetic_modulo: "%",



    drop_down_list_direction: "direction",
    drop_down_list_number: "number",

    drop_down_list_my_item_literal: "my item",

    drop_down_list_object_type_nothing: "nothing",
    drop_down_list_object_type_hero: "hero",
    drop_down_list_object_type_switch: "switch",
    drop_down_list_object_type_bonfire: "bonfire",
    drop_down_list_object_type_cauldron: "cauldron",
    drop_down_list_object_type_spikes: "spikes",
    drop_down_list_object_type_egg: "egg",

    drop_down_list_terrain_type_wall: "wall",
    drop_down_list_terrain_type_floor: "floor",
    drop_down_list_terrain_type_hole: "hole",
    drop_down_list_terrain_type_void: "nothing",


    level_test_failed_modal: "Some of the tests failed.\nWe reproduced the same situation as in these failed attempts.",
    loss_reason_too_many_steps: "Your program takes too much time!",
    loss_reason_all_hero_ended: "Your characters fell asleep before completing the objective",
    loss_reason_all_hero_dead: "All your characters are dead",
    loss_reason_one_hero_dead: "One of your characters is dead",
  },


  'fr': {
    app_fullscreen_modal: "Afin d'avoir la meilleure expérience de jeu possible,\nil est recommandé de jouer en plein écran.",
    app_fullscreen_modal_stop_propose: "Ne plus afficher ce message",
    navigation_exit_button: "Quitter",
    navigation_menu_button: "Menu",
    menu_fullscreen_label: "Plein écran",
    menu_enable_fullscreen: "Plein écran",
    menu_disable_fullscreen: "Quitter le mode plein écran",
    menu_sound_label: "Son",
    menu_music_label: "Musique",
    mute_button_mute: "Désactiver le son",
    mute_button_unmute: "Activer le son",

    screen_size_warning_1: "L'écran de votre appareil est trop petit pour jouer à Selfless Heroes",
    screen_size_warning_2: "Selfless Heroes est conçu pour fonctionner sur ordinateur et tablette. Pour jouer à ce jeu, vous devez avoir un écran d'une taille minimum de {minMaxDimension}\u00A0x\u00A0{minMinDimension} pixels\u00A0: votre écran ne fait que {maxDimension}\u00A0x\u00A0{minDimension} pixels.",

    new_game: "nouvelle partie\u00A0:",
    new_game_name_placeholder: "Pseudo",
    save_career_button: "Enregistrer sous…",
    remove_career_button: "Supprimer",
    remove_career_warning: "Êtes-vous vraiment sûr de vouloir supprimer cette partie\u00A0?\nToute progression sera perdue.",

    level_list_back_button: "Retour",
    level_list_bonus_label: "BONUS",

    level_details_edit_button: "jouer",
    level_details_edit_button_tooltip: "Jouer",
    level_details_back_button: "retour",
    level_details_back_button_tooltip: "Retour",
    level_details_add_solution_button: "Nouvelle solution",
    level_details_duplicate_solution_button: "Dupliquer",
    level_details_duplicate_solution_suffix: " copie",
    level_details_delete_solution_button: "Supprimer",
    level_details_rename_solution_button: "Renommer",
    level_details_name_input_placeholder: "nom",
    level_details_delete_solution_warning: "Êtes-vous vraiment sûr de vouloir supprimer cette solution\u00A0?",

    modal_confirm_button: "ok",
    modal_cancel_button: "annuler",
    modal_close_button: "Fermer",
    modal_confirm_yes: "oui",
    modal_cancel_no: "non",

    tutorial_button_next: "Suivant",

    tutorial_basic_step_tutorial_warning: "Il est conseillé de suivre ce tutoriel avec attention afin de pouvoir jouer le plus vite possible.\n\nClique sur la flèche pour lancer le tutoriel.",
    tutorial_basic_step_graphcode: "Les héros suivent ces instructions dans l'ordre",
    tutorial_basic_step_palette: "Pour changer le comportement des héros, choisis une nouvelle instruction ici et glisse-la à droite",
    tutorial_basic_step_objective: "Pour revoir l'objectif du niveau, clique ici",
    tutorial_basic_step_runbar: "Une fois que ton programme est prêt, clique ici pour le lancer",
    tutorial_basic_step_help: "Pour obtenir plus d'aide ou revoir ce tutoriel, clique ici",

    tutorial_advanced_step_undo: "Annule la dernière modification",
    tutorial_advanced_step_redo: "Rétablit la dernière modification",
    tutorial_advanced_step_delete: "Supprime toutes les instructions",
    tutorial_advanced_step_editor_switch: "Passe à l'éditeur de code.\nAvec l'éditeur de code, vous pouvez copier le programme d'un niveau pour le réutiliser dans un autre.\nLes joueurs les plus avancés peuvent l'utiliser pour créer leur programme directement en code.",
    tutorial_advanced_step_game: "Pour mieux suivre le comportement d'un héro, sélectionne-le en cliquant dessus.\nQuand le programme est lancé, un curseur bleu apparaîtra à gauche des instructions pour montrer à quelle étape du programme se trouve le héro sélectionné.",
    tutorial_advanced_step_play_pause: "Lance ou pause le programme",
    tutorial_advanced_step_step: "Exécute le programme étape par étape",
    tutorial_advanced_step_stop: "Arrête le programme",
    tutorial_advanced_step_speed: "Réglage de vitesse",
    tutorial_advanced_step_menu: "Ouvre le menu",

    level_modal_speed_target_unit: "cycles",
    level_modal_length_target_unit: "lignes",

    level_back_button: "Retour à la liste des niveaux",
    level_help_button: "Aide",
    level_objective_button: "Objectif",

    level_help_modal_title: "Aide",
    level_help_modal_tab_general_title: "général",
    level_help_basic_tutorial_button: "Tutoriel basique",
    level_help_advanced_tutorial_button: "Tutoriel avancé",

    level_help_tab_statement_code_example: "exemple de code:",
    level_help_tab_statement_graph_code_example: "exemple:",

    level_help_tab_if_statement_1: "%%statement branching-statement$si%% permet d'exécuter des instructions seulement si une condition est vraie.",
    level_help_tab_if_statement_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Si la case à ta droite est un mur, alors va à gauche. Sinon va à droite\".",
    level_help_tab_if_statement_3: "%%statement branching-statement$si%% vérifie si la condition est vraie, dans quel cas les instructions à l'intérieur du %%statement branching-statement$si%% (celles à droite de la barre verticale grise) seront exécutées. Sinon les instructions à l'intérieur du %%statement branching-statement$sinon%% (si il y en a un) seront exécutées.",
    level_help_tab_if_statement_4: "%%statement branching-statement$sinon%% ne fait pas partie du %%statement branching-statement$si%% à la base. Pour le faire apparaître, glisse une instruction au-dessus du %%statement branching-statement$si%%.\nPour le faire disparaître, enlève toutes les instructions à l'intérieur du %%statement branching-statement$sinon%%.",
    level_help_tab_if_statement_6: "Clique sur le bouton plus pour ajouter une autre condition.",
    level_help_tab_if_statement_7: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Si la case à ta droite est un mur ou si la case à ta droite est un trou, alors va à gauche\".",

    level_help_tab_jump_statement_1: "%%statement branching-statement$saut%% permet de sauter en avant ou en arrière dans le programme.",
    level_help_tab_jump_statement_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Va à droite en boucle\".",
    level_help_tab_jump_statement_4: "La première ligne crée une \"ancre\" appelée \"a\". La troisième ligne dit de retourner à cette ancre.\nVous pouvez nommer vos ancres avec le nom de votre choix. Chaque jump doit correspondre à une ancre unique.",
    level_help_tab_jump_statement_5: "On utilise souvent %%statement branching-statement$saut%% avec %%statement branching-statement$si%% pour créer des boucles qui s'arrêtent dans certaines conditions.",
    level_help_tab_jump_statement_6: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Va à droite tant que la case à ta droite n'est pas un mur\".",

    level_help_tab_step_function_1: "%%statement action-statement$aller%% dit au héro d'aller dans une direction. Si plusieurs directions sont données, le héro décidera au hasard entre ces directions.",
    level_help_tab_step_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Fais un pas à gauche ou à droite\".",

    level_help_tab_step_once_function_1: "%%statement action-statement$aller%% dit au héro d'aller dans une direction.",
    level_help_tab_step_once_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Fais un pas à droite\".",

    level_help_tab_fireball_function_1: "%%statement action-statement$boule de feu%% lance une boule de feu sur une case autour du héro.\nSi la boule de feu touche un autre héro, celui-ci mourra. On peut utiliser une boule de feu pour allumer un %%icon icon-bonfire$%% feu.",
    level_help_tab_fireball_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Lance une boule de feu à droite\".",

    level_help_tab_take_function_1: "%%statement action-statement$prendre%% dit au héro de prendre un item.",
    level_help_tab_take_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"S'il y a un œuf sur la case à ta droite, prends cet œuf\".",

    level_help_tab_drop_function_1: "%%statement action-statement$déposer%% dit au héro de déposer son item.",
    level_help_tab_drop_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Dépose ton item sur la case à ta droite\".",

    level_help_tab_write_function_1: "%%statement action-statement$écrire%% dit au héro d'écrire quelque chose sur son item.",
    level_help_tab_write_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Écris 3 sur ton item\".",

    level_help_tab_set_function_1: "%%statement assign-statement$init%% initialise une variable.",
    level_help_tab_set_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Donne la valeur 3 à la variable a\".",

    level_help_tab_calc_function_1: "%%statement assign-statement$calc%% fait un calcul et met le résultat dans une variable.",
    level_help_tab_calc_function_2: "On peut lire l'exemple ci-dessus comme suit\u00A0:\n\"Donne la valeur a + 2 à la variable b\".",

    level_objective_modal_objective_title: "objectif",
    level_objective_modal_secondary_objectives_title: "objectifs secondaires",

    win_modal_prior_code_speed: "votre meilleur temps était %%score-number${minStep}%% cycles",
    win_modal_prior_code_length: "votre solution la plus courte faisait %%score-number${minLength}%% lignes",
    win_modal_ok_button: "ok",
    win_modal_continue_edit_button: "améliorer",

    editor_bar_undo_button: "Annuler",
    editor_bar_redo_button: "Rétablir",
    editor_bar_delete_button: "Supprimer",
    editor_bar_switch_to_graph: "Passer à l'éditeur graphique",
    editor_bar_switch_to_code: "Passer à l'éditeur de code",

    code_state_ok_tooltip: "Votre code est prêt à être exécuté",
    code_state_not_runnable_tooltip: "Vos instructions ne sont pas complètes\u00A0:\ncliquez pour plus de détails",
    code_state_not_compilable_tooltip: "Votre code contient une erreur\u00A0:\ncliquez pour plus de détails",
    code_state_ok_modal: "Votre code est prêt à être exécuté",
    code_state_not_runnable_modal: "Votre code contient des mot-clés %%undefined$undefined%%.\nRemplacez-les par des valeurs correctes avant d'exécuter votre code.",
    switch_editor_warning: "Votre code contient une erreur.\nSi vous passez à l'éditeur graphique,\ndes parties de votre code risquent d'être effacées.",
    code_error_position_template: "ligne {line}",
    errors_modal_title: "Erreurs",

    exception_mismatch_statement_template: "vous avez écrit quelque chose d'erroné après cette {statementType}.",
    exception_mismatch_keyword_template: "vous avez écrit quelque chose d'erroné après ce %%keyword${statementType}%%.",
    exception_mismatch_function_template: "vous avez écrit quelque chose d'erroné après la fonction %%function${keyword}()%%.",
    exception_invalid_variable_identifier_template: "%%variable${variable}%% n'est pas un nom de variable autorisé. Utilisez un des noms suivants\u00A0: %%variable${allowedIdentifiers}%%.",
    exception_invalid_value_function_template: "%%function${code}%% n'est pas une fonction valide. Utilisez une des fonctions suivantes\u00A0: %%function${allowedFunctions}%%.",
    exception_forbidden_action_function_template: "%%function${keyword}()%% n'est pas disponible dans ce niveau. Utilisez une des fonctions suivantes\u00A0: %%function${allowedFunctions}%%",
    exception_forbidden_value_function_template: "%%function${keyword}()%% n'est pas disponible dans ce niveau. Utilisez une des fonctions suivantes\u00A0: %%function${allowedFunctions}%%",
    exception_invalid_params_one_dir_integer_variable_myitem_template: "%%function${keyword}()%% attend exactement un paramètre qui peut être un nombre, une variable, une direction ou %%literal$myitem%%",
    exception_invalid_dir_integer_variable_myitem_param_template: "%%variable${param}%% n'est pas une direction, une variable, un nombre ou %%literal$myitem%%",
    exception_invalid_params_one_integer_or_variable_template: "%%function${keyword}()%% attend exactement un paramètre qui peut être un nombre ou une variable",
    exception_invalid_integer_or_variable_param_template: "%%variable${param}%% n'est pas une variable ou un nombre valide",
    exception_invalid_params_one_dir_template: "%%function${keyword}()%% attend exactement un paramètre de direction\u00A0: %%literal${directions}%%",
    exception_invalid_params_one_more_dir_template: "%%function${keyword}()%% attend un ou plusieurs paramètres de direction\u00A0: %%literal${directions}%%",
    exception_invalid_direction_param_template: "%%variable${param}%% n'est pas une direction valide. Utilisez celles-là\u00A0: %%literal${allowedValues}%%",
    exception_invalid_params_calc_function_template: "%%function${keyword}()%% prend 3 paramètres. Les paramètres 1 et 3 doivent être des nombres, des directions, %%literal$myitem%% ou des variables et le paramètre 2 doit être un opérateur (%%operator${operators}%%)",
    exception_duplicate_param_template: "vous ne pouvez pas donner deux fois %%literal${param}%% à %%function${keyword}()%%",
    exception_forbidden_object_type_template: "le type d'objet %%literal${keyword}%% n'est pas disponible dans ce niveau. Vous pouvez utiliser l'un des suivants\u00A0: %%literal${allowedValues}%%",
    exception_forbidden_terrain_type_template: "le type de terrain %%literal${keyword}%% n'est pas disponible dans ce niveau. Vous pouvez utiliser l'un des suivants\u00A0: %%literal${allowedValues}%%",
    exception_boolean_no_comparison_operator_template: "une condition doit contenir un comparateur valide comme ceux-ci\u00A0: %%operator${allowedOperators}%%",
    exception_invalid_expression_template: "%%variable${code}%% n'est pas un mot-clé valide",
    exception_invalid_statement_template: "%%variable${code}%% n'est pas une instruction valide",
    exception_forbidden_variable_identifier_template: "la variable %%variable${variable}%% n'est pas disponible dans ce niveau. Vous pouvez utiliser l'une des suivantes\u00A0: %%variable${allowedNames}%%",
    exception_all_forbidden_variable_identifier_template: "les variables ne sont pas disponibles dans ce niveau",

    exception_open_statement_template: "la condition du %%keyword${keyword}%% doit être fermée avec un %%code$:%%",
    exception_else_no_if_template: "%%keyword${elseKeyword}%% sans %%keyword${ifKeyword}%% avant",
    exception_endif_no_if_template: "%%keyword${endifKeyword}%% sans %%keyword${ifKeyword}%% avant",
    exception_if_no_endif_template: "%%keyword${ifKeyword}%% sans %%keyword${endifKeyword}%%",
    exception_duplicate_anchor_template: "%%bracket${anchorName}:%% trouvée deux fois. Les ancres doivent avoir des noms uniques",
    exception_jump_to_unknown_anchor_template: "%%keyword${jumpKeyword}%% vers une ancre inconnue %%bracket${anchorName}:%%",

    type_anchor: "ancre",
    type_assign: "assignation",
    type_direction: "direction",

    graph_node_if: "si",
    graph_node_else: "sinon",
    graph_node_jump: "saut",

    graph_node_function_step: "aller",
    graph_node_function_fireball: "boule de feu",
    graph_node_function_set: "init",
    graph_node_function_calc: "calc",
    graph_node_function_take: "prendre",
    graph_node_function_drop: "déposer",
    graph_node_function_write: "écrire",

    operator_boolean_and: "et",
    operator_boolean_or: "ou",
    operator_boolean_delete: "enlever",

    drop_down_list_direction: "direction",
    drop_down_list_number: "nombre",

    drop_down_list_my_item_literal: "mon item",

    drop_down_list_object_type_nothing: "rien",
    drop_down_list_object_type_hero: "héro",
    drop_down_list_object_type_switch: "bouton",
    drop_down_list_object_type_bonfire: "feu",
    drop_down_list_object_type_cauldron: "chaudron",
    drop_down_list_object_type_spikes: "piques",
    drop_down_list_object_type_egg: "œuf",

    drop_down_list_terrain_type_wall: "mur",
    drop_down_list_terrain_type_floor: "sol",
    drop_down_list_terrain_type_hole: "trou",
    drop_down_list_terrain_type_void: "vide",



    level_test_failed_modal: "Certains tests ont échoué.\nNous avons reproduit une des situations problématiques.",
    loss_reason_too_many_steps: "Votre programme prend trop de temps\u00A0!",
    loss_reason_all_hero_ended: "Vos personnages se sont endormis avant de remplir l'objectif",
    loss_reason_all_hero_dead: "Tous vos personnages sont morts",
    loss_reason_one_hero_dead: "Un de vos personnages est mort",
  }
}

class Idiom {
  constructor(messages, languages) {
    this.messages = messages
    this.languages = languages

    this.currentLanguage = messages.default

    let supportedLanguage = languages.find(lang => !!this.messages[lang])
    if (supportedLanguage) {
      this.currentLanguage = supportedLanguage
    }
  }

  getMessage(key) {
    let message = this.messages[this.currentLanguage][key]
    if (!message) {
      message = this.messages[this.messages.default][key]

      if (!message) {
        throw new Error(`lang::: message not found [${key}]`)
      }
    }
    return message
  }

  pushMessage(key, message) {
    if (typeof message === 'string') {
      this.messages[this.messages.default][key] = message
    } else {
      let defaultMessage = ''
      let foundDefaultLanguage = false

      for (let language in message) {
        if (message.hasOwnProperty(language)) {
          defaultMessage = message[language]

          if (this.messages.hasOwnProperty(language)) {
            this.messages[language][key] = message[language]

            if (language === this.messages.default) {
              foundDefaultLanguage = true
            }
          }
        }
      }
      if (!foundDefaultLanguage) {
        this.messages[this.messages.default][key] = defaultMessage
      }
    }
  }

  text(key, templateValues) {
    if (templateValues) {
      return this.formatTemplate(key, templateValues)
    } else {
      return this.getMessage(key)
    }
  }

  formatTemplate(templateKey, templateValues) {
    let template = this.getMessage(templateKey)
    let values = {}
    for (let key in templateValues) {
      let templateValue = templateValues[key]
      let value = templateValue
      // the value can be a nested template
      if (typeof value === 'object' && templateValue.template) {
        value = this.text(templateValue.template, templateValue.values)
      }
      values[key] = value
    }

    return format(template, values)
  }
}
let languages = []
if (typeof window !== 'undefined') {
  languages = window.navigator.languages
}
export default new Idiom(messages, languages)