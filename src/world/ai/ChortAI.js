import AI from './AI'
import Direction from '../Direction'
import Spikes from '../objects/Spikes'
import StepAction from '../actions/StepAction'
import EatAction from '../actions/EatAction'
import WaitAction from '../actions/WaitAction'
import CloneAction from '../actions/CloneAction'
import WorldObjectFinder from './WorldObjectFinder'


const states = {
  'placing': 0,
  'clone_cloner': 1,
  'cloning': 2,
  'walking': 3,
  'chasing': 4,
}
export default class ChortAI extends AI {
  constructor(world, character, config) {
    super(world, character)

    this.config = config

    this.state = this.config.startState !== undefined ? states[this.config.startState] : states.placing
    this.lastAction = null
    this.updateLastAction()

    this.chasedHero = null
    this.hasCloned = false
  }

  step(rng) {
    switch (this.state) {
      case states.placing:
        return this.placeYourself(rng)
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
      [2, 2],
      [6, 3],
      [10, 4],
      [14, 5],
      [18, 6],
    ]
    return clonerPositions.every(pos => this.world.getCharactersAt(pos[0], pos[1]).length > 0)
  }

  placeYourself(rng) {
    const actionRythm = 4

    if (this.world.steps - this.lastAction.step >= actionRythm) {
      this.updateLastAction()
      let direction = Direction.e
      if (this.world.map.isInfected(this.character.x, this.character.y + 1)) {
        this.state = states.clone_cloner
        direction = Direction.s
      }
      return new StepAction(direction)
    }

    return new WaitAction()
  }

  cloneCloner(rng) {
    let actionRythm = 4
    if (this.character.y === 2) {
      actionRythm = 5
    }

    if (this.isEveryClonerInPlace()) {
      this.updateLastAction()
      this.state = states.cloning
      return this.cloneYourself(rng)
    }

    if (this.world.steps - this.lastAction.step >= actionRythm) {
      this.updateLastAction()
      this.state = states.cloning
      return new CloneAction(Direction.e, {
        aiConfig: {
          type: 'chort',
          startState: 'placing',
        }
      }, false)
    }

    return new WaitAction()
  }

  cloneYourself(rng) {
    let actionRythm = 3
    let startDelay = -2 * (this.character.y - 3) + 6
    if (this.character.y === 2) {
      startDelay = 17
      actionRythm = 1
    }

    if (this.isEveryClonerInPlace()) {
      if (this.lastAction.state !== states.cloning) {
        this.updateLastAction()
        if (this.world.steps - this.lastAction.step >= startDelay) {
          this.hasCloned = true
          return new CloneAction(Direction.e, {
            aiConfig: {
              type: 'chort',
              startState: 'walking',
            }
          }, false)
        }
      } else if ((!this.hasCloned && this.world.steps - this.lastAction.step >= startDelay) || (this.hasCloned && this.world.steps - this.lastAction.step >= actionRythm)) {
        this.hasCloned = true
        this.updateLastAction()
        return new CloneAction(Direction.e, {
          aiConfig: {
            type: 'chort',
            startState: 'walking',
          }
        }, false)
      }
    }


    return new WaitAction()
  }

  walkForward(rng) {
    if (this.character.x >= 22) {
      this.state = states.chasing
      return this.chaseHero(rng)
    }
    return new StepAction(Direction.e)
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