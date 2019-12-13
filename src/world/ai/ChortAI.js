import AI from './AI'
import Direction from '../Direction'
import Spikes from '../objects/Spikes'
import StepAction from '../actions/StepAction'
import EatAction from '../actions/EatAction'
import WaitAction from '../actions/WaitAction'
import CloneAction from '../actions/CloneAction'
import WorldObjectFinder from './WorldObjectFinder'


const states = {
  'clone_cloner': 0,
  'cloning': 1,
  'walking': 2,
  'chasing': 3,
}


// Time distance to heroes
// 24
// 18
// 12
// 6

const startCloneCloner = [
  1,
  5,
  9,
  13,
  17,
]

const startCloning = [
  2,
  10,
  14,
  14,
  22,
]

////// MIN VALUES
// const startCloneCloner = [
//   1,
//   2,
//   3,
//   4,
//   5,
// ]
//
// const startCloning = [
//   2,
//   3,
//   10,
//   11,
//   17,
// ]


/////// MAX VALUES
// const startCloneCloner = [
//   1,
//   7,
//   13,
//   19,
//   25,
// ]
//
// const startCloning = [
//   31,
//   31,
//   31,
//   31,
//   39,
// ]
// Heroes ready to fire
// 54   27
// 48   28
// 40   23
// 42   22

export default class ChortAI extends AI {
  constructor(world, character, config) {
    super(world, character)

    this.config = config

    this.state = this.config.startState !== undefined ? states[this.config.startState] : states.placing
    this.lastAction = null
    this.updateLastAction()

    this.chasedHero = null
    this.stateStarted = false
  }

  step(rng) {
    switch (this.state) {
      case states.clone_cloner:
        return this.cloneCloner(rng)
      case states.cloning:
        return this.cloneYourself(rng)
      case states.walking:
        return this.walkForward(rng)
      case states.chasing:
        return this.chaseHero(rng)
      default:
        return this.placeYourself(rng)
    }
  }

  updateLastAction() {
    this.lastAction = {
      state: this.state,
      step: this.world.steps !== undefined ? this.world.steps : 0
    }
  }

  isEveryClonerInPlace() {
    let clonerPositions = [
      [17, 2],
      [18, 3],
      [19, 4],
      [20, 5],
      [21, 6],
    ]
    return clonerPositions.every(pos => this.world.getCharactersAt(pos[0], pos[1]).length > 0)
  }

  cloneCloner(rng) {
    if (this.isEveryClonerInPlace()) {
      this.updateLastAction()
      this.state = states.cloning
    } else {
      if (this.world.steps >= startCloneCloner[this.character.y - 2]) {
        this.updateLastAction()
        this.state = states.cloning
        return new CloneAction(Direction.se, {
          aiConfig: {
            type: 'chort',
            startState: 'clone_cloner',
          }
        }, false)
      }
    }

    return new WaitAction()
  }

  cloneYourself(rng) {
    let actionRythm = 4
    if (this.character.y === 2) {
      actionRythm = 8
    }

    if (this.lastAction.state !== states.cloning && this.world.steps >= startCloning[this.character.y - 2] ||
      this.lastAction.state === states.cloning && this.world.steps - this.lastAction.step >= actionRythm) {
      this.updateLastAction()
      return new CloneAction(Direction.w, {
        aiConfig: {
          type: 'chort',
          startState: 'walking',
        }
      }, false)
    }


    return new WaitAction()
  }

  walkForward(rng) {
    let actionRythm = 2
    if (this.character.y === 2) {
      actionRythm = 4
    }
    if (this.world.steps - this.lastAction.step >= actionRythm) {
      this.updateLastAction()
      if (this.character.x <= 4 || !this.world.map.isFloor(this.character.x - 1, this.character.y)) {
        this.state = states.chasing
        return this.chaseHero(rng)
      }
      return new StepAction(Direction.w)
    }
  }

  chaseHero(rng) {
    let action = new WaitAction()

    if (this.chasedHero && this.chasedHero.dead) {
      this.chasedHero = null
    }

    if (!this.chasedHero) {
      this.chasedHero = this.findNearestHero()
    }

    if (this.chasedHero) {
      let objectFinder = new WorldObjectFinder(this.chasedHero, this.character, this.world)
      let direction = objectFinder.findDirection()
      action = new StepAction(direction)
    }
    return action
  }

  findNearestHero() {
    let aliveHeroes = this.world.heroes.filter(hero => !hero.dead)
    let distances = aliveHeroes.map(hero => ({
      hero: hero,
      distance: this.character.distanceFrom(hero),
    }))
    let shortestDistance = distances.reduce((acc, dist) => !acc || dist.distance < acc.distance ? dist : acc, null)

    return shortestDistance && shortestDistance.hero
  }
}