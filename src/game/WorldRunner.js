import Speeds from './Speeds'

export default class WorldRunner {
  constructor() {
    this.world = null
    this.stepInterval = 200
    this.speed = Speeds.values[Speeds.default]
    this.timerID = -1
    this.steps = 0
  }

  init(world) {
    this.world = world
    this.steps = world.steps
  }

  restart(world) {
    this.init(world)
    this.emitStateChange()
  }

  step() {
    if (!this.world.gameOver) {
      this.steps++

      this.world.step()

      if (this.steps === 1 || this.world.gameOver) {
        this.emitStateChange()
      }

      if (this.world.gameOver) {
        this.pause()
      }
    }
  }

  play() {
    if (this.isPaused() && !this.world.gameOver) {
      this.timerID = setInterval(this.step.bind(this), this.stepInterval / this.speed)
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
      this.play()
    }
  }

  setStateListener(listener) {
    this.stateListener = listener
  }

  emitStateChange(state = this.getObservableState()) {
    if (this.stateListener) {
      this.stateListener(state)
    }
  }

  getObservableState() {
    return {
      speed: this.speed,
      hasWon: this.world.hasWon,
      hasLost: this.world.hasLost,
      gameOver: this.world.gameOver,
      paused: this.isPaused(),
      steps: this.steps,
    }
  }
}