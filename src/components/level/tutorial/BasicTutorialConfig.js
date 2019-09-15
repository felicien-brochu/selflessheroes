import TutorialConfig from './TutorialConfig'
import {
  TutorialStep,
  TutorialAnchor
} from './TutorialConfig'

const tutorial = new TutorialConfig()

const getByID = id => (() => document.getElementById(id))
const getByClass = className => (() => document.getElementsByClassName(className)[0])

let anchor = new TutorialAnchor(
  getByClass('Pane'), {
    position: 'bottom',
    origin: 'center',
    offset: 0
  }, {
    x: 'center',
    y: 'center'
  }, {
    x: 0,
    y: 0
  })
let step = new TutorialStep(anchor, 'tutorial_basic_step_tutorial_warning')
tutorial.addStep(step)

anchor = new TutorialAnchor(
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
step = new TutorialStep(anchor, 'tutorial_basic_step_graphcode')
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

anchor = new TutorialAnchor(getByClass('play-pause-button'), 'bottom', 'center', 'start', 0, -5)
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
step = new TutorialStep(anchor, 'tutorial_basic_step_runbar')
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