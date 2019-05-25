import TutorialConfig from './TutorialConfig'
import {
  TutorialStep,
  TutorialAnchor
} from './TutorialConfig'

const tutorial = new TutorialConfig()

const getByID = id => (() => document.getElementById(id))
const getByClass = className => (() => document.getElementsByClassName(className)[0])

let anchor = new TutorialAnchor(getByID('graph-code'), 'top', 'start', 'start', 120, 120)
let step = new TutorialStep(anchor, 'tutorial_default_step_graphcode')
tutorial.addStep(step)

anchor = new TutorialAnchor(getByClass('palette'), 'right', 'start', 'center', 7)
step = new TutorialStep(anchor, 'tutorial_default_step_palette')
tutorial.addStep(step)

anchor = new TutorialAnchor(getByClass('objective-button'), 'top', 'center', 'end', 0, 5)
step = new TutorialStep(anchor, 'tutorial_default_step_objective')
tutorial.addStep(step)

anchor = new TutorialAnchor(getByClass('play-pause-button'), 'bottom', 'center', 'start', 0, -5)
step = new TutorialStep(anchor, 'tutorial_default_step_runbar')
tutorial.addStep(step)

export default tutorial