import format from 'string-template'

const messages = {
  default: 'en',

  'en': {
    home_title: "AI World",
    new_game: "new game:",
    new_game_name_placeholder: "Pseudo",
    remove_career_button: "Remove",
    remove_career_warning: "Are you really sure to delete this game?\nAll progression will be lost.",

    modal_confirm_button: "ok",
    modal_cancel_button: "cancel",
    modal_close_button: "close",

    editor_bar_objective_button: "Objective",
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
    exception_invalid_params_one_dir_or_integer_template: "%%function${keyword}()%% requires exactly one parameter which can be a number or a direction: %%literal${directions}%%",
    exception_invalid_dir_or_integer_param_template: "%%variable${param}%% is not a valid number or direction",
    exception_invalid_params_one_dir_template: "%%function${keyword}()%% requires exactly one direction parameter: %%literal${directions}%%",
    exception_invalid_params_one_more_dir_template: "%%function${keyword}()%% requires one or more direction parameters: %%literal${directions}%%",
    exception_invalid_direction_param_template: "%%variable${param}%% is not a valid direction. Use one of these : %%literal${allowedValues}%%",
    exception_invalid_params_calc_function_template: "%%function${keyword}()%% takes 3 parameters. Params 1 and 3 must be numbers or variables and param 2 must be an operator",
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
    function_set: "set",
    function_calc: "calc",

    graph_node_if: "if",
    graph_node_else: "else",
    graph_node_jump: "jump",

    graph_node_function_step: "step",
    graph_node_function_set: "set",
    graph_node_function_calc: "calc",


    loss_reason_too_many_steps: "Your program takes too much time!",
    loss_reason_all_hero_ended: "Why do you stop now?\nThere is still a lot of work left!",
    level_test_failed_modal: "Some of the tests failed.\nWe reproduced the same situation as in these failed attempts.",

    win_modal_code_speed: "average time:\u00A0%%score${codeSpeed}%%\u00A0/{speedTarget}",
    win_modal_prior_code_speed: "your shortest one was %%score${minStep}%%",
    win_modal_code_length: "length:\u00A0%%score${codeLength}%%\u00A0/{lengthTarget}",
    win_modal_prior_code_length: "your smallest one was %%score${minLength}%% lines long",
    win_modal_ok_button: "ok",
    win_modal_continue_edit_button: "keep at it",
  },


  'fr': {
    home_title: "AI World",
    new_game: "nouvelle partie\u00A0:",
    new_game_name_placeholder: "Pseudo",
    remove_career_button: "Supprimer",
    remove_career_warning: "Êtes-vous vraiment sûr de vouloir supprimer cette partie\u00A0?\nToute progression sera perdue.",

    modal_confirm_button: "ok",
    modal_cancel_button: "annuler",
    modal_close_button: "fermer",

    editor_bar_objective_button: "Objectif",
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
    exception_invalid_params_one_dir_or_integer_template: "%%function${keyword}()%% attend exactement un paramètre qui peut être un nombre ou une direction\u00A0: %%literal${directions}%%",
    exception_invalid_dir_or_integer_param_template: "%%variable${param}%% n'est pas une direction ou un nombre valide",
    exception_invalid_params_one_dir_template: "%%function${keyword}()%% attend exactement un paramètre de direction\u00A0: %%literal${directions}%%",
    exception_invalid_params_one_more_dir_template: "%%function${keyword}()%% attend un ou plusieurs paramètres de direction\u00A0: %%literal${directions}%%",
    exception_invalid_direction_param_template: "%%variable${param}%% n'est pas une direction valide. Utilisez celles-là\u00A0: %%literal${allowedValues}%%",
    exception_invalid_params_calc_function_template: "%%function${keyword}()%% prend 3 paramètres. Les paramètres 1 et 3 doivent être des nombres ou des variables et le paramètre 2 doit être un opérateur",
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

    graph_node_function_step: "va",
    graph_node_function_set: "init",
    graph_node_function_calc: "calc",



    loss_reason_too_many_steps: "Votre programme prend trop de temps\u00A0!",
    loss_reason_all_hero_ended: "Pourquoi vous vous arrêtez maintenant\u00A0?\nIl reste encore du boulot\u00A0!",
    level_test_failed_modal: "Certains tests ont échoué.\nNous avons reproduit une des situations problématiques.",

    win_modal_code_speed: "temps moyen:\u00A0%%score${codeSpeed}%%\u00A0/{speedTarget}",
    win_modal_prior_code_speed: "votre meilleur temps était %%score${minStep}%%",
    win_modal_code_length: "longueur:\u00A0%%score${codeLength}%%\u00A0/{lengthTarget}",
    win_modal_prior_code_length: "votre solution la plus courte faisait %%score${minLength}%% lignes",
    win_modal_ok_button: "ok",
    win_modal_continue_edit_button: "continuer",
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
        message = null
        throw new Error(`lang::: message not found [${key}]`)
      }
    }
    return message
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