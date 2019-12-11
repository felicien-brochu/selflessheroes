import AI from './AI'
import Direction from '../Direction'
import Spikes from '../objects/Spikes'
import StepAction from '../actions/StepAction'
import EatAction from '../actions/EatAction'
import WaitAction from '../actions/WaitAction'
import WorldObjectFinder from './WorldObjectFinder'


export default class KronosAI extends AI {
  constructor(world, character, config) {
    super(world, character)

    this.config = config

    this.chasing = false
    this.goingUp = true
    this.stepsToEgg = 2
    this.waitStepsToGo = 0
    this.goingToEat = false
    this.lastEatenValue = 0
    this.chasedHero = null
  }

  step(rng) {
    if (this.chasing) {
      return this.chaseHero(rng)
    } else {
      return this.gluttonUp(rng)
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

  gluttonUp(rng) {
    let action = new WaitAction()

    if (this.stepsToEgg <= 0) {
      if (this.goingToEat) {
        let eggToEat = this.world.eggs.find(egg => this.character.overlaps(egg) && !egg.owner)
        if (!eggToEat || eggToEat.value !== this.lastEatenValue + 1) {
          this.chasing = true
          return this.chaseHero(rng)
        }
        this.lastEatenValue++
        action = new EatAction()
        this.goingToEat = false
        this.waitStepsToGo = this.getWaitStepsOnEgg()
      } else {
        if (this.waitStepsToGo <= 0) {
          let nextToWall = (!this.goingUp && this.world.map.isWall(this.character.x, this.character.y + 1)) ||
            (this.goingUp && this.world.map.isWall(this.character.x, this.character.y - 1))
          this.stepsToEgg = nextToWall ? 1 : 2
        } else {
          this.waitStepsToGo--
        }
      }


    }
    if (this.stepsToEgg > 0) {
      let direction = new Direction(0, this.goingUp ? -1 : 1)
      if (this.world.map.isWall(this.character.x + direction.dx, this.character.y + direction.dy)) {
        direction = new Direction(1, 0)
        this.goingUp = !this.goingUp
      }
      action = new StepAction(direction)
      this.stepsToEgg--
      if (this.stepsToEgg <= 0) {
        this.goingToEat = true
      }
    }

    return action
  }

  getWaitStepsOnEgg() {
    let eggsReady = this.world.eggs.filter(egg => !egg.owner && egg.x <= 7).length - this.lastEatenValue + 1
    let sortedEggs = this.world.eggs.filter(egg => !egg.owner && egg.x <= 7).sort((a, b) => a.value - b.value)
    let lastValue = 0
    for (let egg of sortedEggs) {
      if (egg.value !== lastValue + 1) {
        break
      }
      lastValue++
    }
    let biggestNextEgg = lastValue
    if (biggestNextEgg >= 19) {
      return 0
    }
    if (biggestNextEgg <= 3) {
      return 6
    }
    let stock = biggestNextEgg - this.lastEatenValue
    const maxStepsOnEgg = 9
    const minStepsOnEgg = 1
    const maxStock = 4
    const a = -(maxStepsOnEgg - minStepsOnEgg) / maxStock

    return Math.floor(a * stock + maxStepsOnEgg)
  }
}