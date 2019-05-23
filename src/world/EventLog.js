import EventEmitter from 'events'

export default class EventLog {
  constructor(world) {
    this.world = world
    this.log = []
    this.events = new EventEmitter()

    this.onHeroDie = this.onHeroDie.bind(this)
  }

  attach() {
    for (let hero of this.world.heroes) {
      hero.events.on('die', this.onHeroDie)
    }
  }

  detach() {
    for (let hero of this.world.heroes) {
      hero.events.off('die', this.onHeroDie)
    }
  }

  logEvent(type, data, step = this.world.steps) {
    let event = {
      step: step,
      type: type,
      ...data
    }
    Object.freeze(event)
    this.log.push(event)
  }

  search(request) {
    let results = this.log.slice(0)
    for (let key of Object.keys(request)) {
      results = results.filter(event => typeof event[key] !== 'undefined' && event[key] === request[key])
    }

    return results
  }



  onHeroDie(hero) {
    this.logEvent('hero-death', {
      heroID: hero.id,
      deathReason: hero.deathReason
    })
  }
}