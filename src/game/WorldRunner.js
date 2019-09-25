import World from '../world/World'
import Speeds from './Speeds'
import seedrandom from 'seedrandom'
import EventEmitter from 'events'

const defaultStepInterval = 600

export default class WorldRunner {
  constructor() {
    this.world = null
    this.speed = Speeds.values[Speeds.default]
    this.timerID = -1
    let {
      rng,
      seed
    } = WorldRunner.buildRNG()

    this.rng = rng
    this.rngSeed = seed
    this.gameOver = false
    this.gameOverDeclared = false

    this.events = new EventEmitter()
  }

  get stepInterval() {
    return defaultStepInterval / this.speed
  }

  init(level, aiFactory, rngSeed) {
    if (rngSeed) {
      this.rngSeed = rngSeed
    }
    this.rng = seedrandom(this.rngSeed)
    this.world = new World(level, aiFactory, this.rng)
    this.gameOver = false
    this.gameOverDeclared = false
  }

  static buildRNG() {
    return seedrandom(null, {
      pass: (rng, seed) => {
        return {
          rng: rng,
          seed: seed
        }
      }
    })
  }

  restart(level, aiFactory, rngSeed) {
    this.init(level, aiFactory, rngSeed)
    this.emitStateChange()
  }

  step() {
    this.events.emit('before-step', this.world)

    this.world.step()

    if (this.gameOver) {
      this.gameOverDeclared = true
    }
    this.emitStateChange()
    this.events.emit('after-step', this.world)

    if (this.gameOver) {
      this.pause()
      this.events.emit('game-over', this.world)
    }
    if (this.world.gameOver) {
      this.gameOver = true
    }
  }

  play(immediateStep = true) {
    if (this.isPaused() && !this.gameOverDeclared) {
      if (immediateStep) {
        this.step()
      }
      this.timerID = setInterval(this.step.bind(this), this.stepInterval)
      this.emitStateChange()
    }
  }

  pause() {
    if (!this.isPaused()) {
      clearInterval(this.timerID)
      this.timerID = -1
      this.emitStateChange()
    }
  }

  isPaused() {
    return this.timerID < 0
  }

  doOneStep() {
    this.pause()
    this.step()
  }

  setSpeed(speed) {
    this.speed = speed
    if (!this.isPaused()) {
      this.pause()
      this.play(false)
    }
  }

  setStateListener(listener) {
    this.stateListener = listener
  }

  emitStateChange(state = this.getObservableState()) {
    this.events.emit('world-state-change', state)
  }

  getObservableState() {
    return {
      steps: this.world.steps,
      speed: this.speed,
      hasWon: this.gameOverDeclared && this.world.hasWon,
      hasLost: this.gameOverDeclared && this.world.hasLost,
      gameOver: this.gameOverDeclared,
      lossReason: this.world.ruleset.getLossReason(),
      paused: this.isPaused(),
      debugContext: this.world.getDebugContext()
    }
  }
}