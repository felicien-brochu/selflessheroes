import AI from './AI'
import Direction from '../Direction'
import Spikes from '../objects/Spikes'
import StepAction from '../actions/StepAction'
import WaitAction from '../actions/WaitAction'
import WorldObjectFinder from './WorldObjectFinder'


export default class GatekeeperAI extends AI {
  constructor(world, character, config) {
    super(world, character)

    this.config = config
    this.lastStep = -1000
    this.chasing = false



    this.chasedHero = this.world.findWorldObjectByID(this.config.chasedHero)
    this.upSwitch = this.world.findWorldObjectByID(this.config.upSwitch)
    this.downSwitch = this.world.findWorldObjectByID(this.config.downSwitch)

    this.nextSwitch = this.upSwitch
    this.stepsBeforeSwitch = null
    this.stayOnSwitch = false
    this.stepsOnSwitch = 0
  }

  step(rng) {
    if (this.chasedHero.x <= this.character.x) {
      this.chasing = true
    }

    if (this.chasing) {
      return this.chaseHero(rng)
    } else {
      return this.alternateSwitch(rng)
    }
  }

  chaseHero(rng) {
    let action = new WaitAction()

    let objectFinder = new WorldObjectFinder(this.chasedHero, this.character, this.world)
    let direction = objectFinder.findDirection()
    action = new StepAction(direction)
    return action
  }

  alternateSwitch(rng) {
    const maxStepsOnSwith = 9
    let action = new WaitAction()

    if (this.stayOnSwitch) {
      this.stepsOnSwitch++
      if (this.stepsOnSwitch >= maxStepsOnSwith - 1) {
        this.nextSwitch = this.nextSwitch === this.upSwitch ? this.downSwitch : this.upSwitch
        this.stepsBeforeSwitch = null
        this.stayOnSwitch = false
      }
    } else {
      if (this.character.overlaps(this.nextSwitch)) {
        this.stayOnSwitch = true
        this.stepsOnSwitch = 1
      } else if (this.stepsBeforeSwitch === null) {
        this.stepsBeforeSwitch = Math.abs(this.nextSwitch.y - this.character.y) + Math.floor(rng() * 3) + 1
        let direction = new Direction(0, Math.sign(this.nextSwitch.y - this.character.y))
        action = new StepAction(direction)
        this.stepsBeforeSwitch--
      } else {
        let vectorDir = this.nextSwitch.y - this.character.y
        let signDir = Math.sign(vectorDir)
        let minSteps = Math.abs(vectorDir)

        const directions = []
        if (!(this.stepsBeforeSwitch > 1 && minSteps === 1)) {
          directions.push(1)
        }
        if (this.stepsBeforeSwitch >= minSteps + 1) {
          directions.push(0)
        }
        if (this.stepsBeforeSwitch >= minSteps + 2) {
          directions.push(-1)
        }

        let pickDir = directions[Math.floor(rng() * directions.length)]
        let direction = new Direction(0, pickDir * signDir)
        action = new StepAction(direction)
        this.stepsBeforeSwitch--
      }
    }
    return action
  }
}