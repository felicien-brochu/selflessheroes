import EventEmitter from 'events'

export default class EventLog {
  constructor(world) {
    this.world = world
    this.log = []
    this.events = new EventEmitter()

    this.onHeroDie = this.onHeroDie.bind(this)
    this.onWriteEgg = this.onWriteEgg.bind(this)
    this.onEggFellInHole = this.onEggFellInHole.bind(this)
    this.onPutItemInCauldron = this.onPutItemInCauldron.bind(this)
  }

  attach() {
    for (let hero of this.world.heroes) {
      hero.events.on('die', this.onHeroDie)
    }

    for (let egg of this.world.eggs) {
      egg.events.on('write', this.onWriteEgg)
      egg.events.on('fell-in-hole', this.onEggFellInHole)
    }

    for (let cauldron of this.world.cauldrons) {
      cauldron.events.on('put-item', this.onPutItemInCauldron)
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

  onWriteEgg(egg, oldValue, newValue) {
    this.logEvent('egg-write', {
      eggID: egg.id,
      oldValue,
      newValue
    })
  }

  onEggFellInHole(egg) {
    this.logEvent('egg-fell-in-hole', {
      eggID: egg.id,
    })
  }

  onPutItemInCauldron(cauldron, item) {
    this.logEvent('put-item-cauldron', {
      cauldronID: cauldron.id,
      itemID: item.id,
    })
  }
}