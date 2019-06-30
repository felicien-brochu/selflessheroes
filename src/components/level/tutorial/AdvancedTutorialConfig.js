import TutorialConfig from './TutorialConfig'
import {
  TutorialStep,
  TutorialAnchor
} from './TutorialConfig'

const tutorial = new TutorialConfig()

const getByID = id => (() => document.getElementById(id))
const getByClass = className => (() => document.getElementsByClassName(className)[0])


let anchor = new TutorialAnchor(
  getByID('graph-code'), {
    position: 'top',
    origin: 'center',
    offset: 0
  }, {
    x: 'start',
    y: 'start'
  }, {
    x: 120,
    y: 120
  })
let step = new TutorialStep(anchor, 'tutorial_basic_step_graphcode')
tutorial.addStep(step)


anchor = new TutorialAnchor(
  getByClass('palette'), {
    position: 'right',
    origin: 'center',
    offset: 0
  }, {
    x: 'start',
    y: 'center'
  }, {
    x: 7,
    y: 0
  })
step = new TutorialStep(anchor, 'tutorial_basic_step_palette')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('undo-button'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_undo')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('redo-button'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_redo')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('delete-code-button'), {
    position: 'bottom',
    origin: 'end',
    offset: -100
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_delete')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByID('editor-switch'), {
    position: 'bottom',
    origin: 'end',
    offset: -30
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -16
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_editor_switch')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('Pane'), {
    position: 'top',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'center'
  }, {
    x: 0,
    y: 0
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_game')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('play-pause-button'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_play_pause')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('step-button'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_step')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('stop-button'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_stop')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('speed-range'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'start'
  }, {
    x: 0,
    y: -5
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_speed')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('menu-button'), {
    position: 'top',
    origin: 'start',
    offset: 50
  }, {
    x: 'center',
    y: 'end'
  }, {
    x: -3,
    y: 0
  })
step = new TutorialStep(anchor, 'tutorial_advanced_step_menu')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('objective-button'), {
    position: 'top',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'end'
  }, {
    x: 0,
    y: 5
  })
step = new TutorialStep(anchor, 'tutorial_basic_step_objective')
tutorial.addStep(step)

anchor = new TutorialAnchor(
  getByClass('help-button'), {
    position: 'top',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'end'
  }, {
    x: 0,
    y: 5
  })
step = new TutorialStep(anchor, 'tutorial_basic_step_help')
tutorial.addStep(step)

export default tutorial