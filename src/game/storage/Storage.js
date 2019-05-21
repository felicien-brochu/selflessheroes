import StorageWrapper from './StorageWrapper'
import Career from './Career'

const version = '[AIV]{version}[/AIV]'

export class Storage extends StorageWrapper {
  constructor(storageKey) {
    super(storageKey)

    this.version = version
    this.careers = []
  }

  // Do not call directly this method. Call set() instead with the same arguments as this one
  init() {}

  createCareer(name) {
    const id = StorageWrapper.getAvailableID(this.careers)
    const career = new Career(`${this.storageKey}.careers[${id}]`)
    career.set(id, name)
    this.careers.push(career)
    career.save(false)
    this.save(false)

    return career
  }

  getCareer(id) {
    return this.careers.find(c => c.get().id === id)
  }

  deleteCareer(careerID) {
    let career = this.getCareer(careerID)
    career.clear()
    this.careers.splice(this.careers.indexOf(career), 1)
    this.save(false)

    // Safety feature: when no career remove all from local storage
    if (this.careers.length === 0) {
      this.cleanLocalStorage()
    }
  }

  cleanLocalStorage() {
    // Remove all that is not this object from local storage
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)
      if (key !== this.storageKey) {
        localStorage.removeItem(key)
        i--
      }
    }
  }

  load(data) {
    this.version = data.version
    this.careers = super.loadIDArray(data.careers, 'careers', Career)
    return true
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      version: this.version,
      careers: super.toIDArray(this.careers)
    })

    return o
  }
}

const mainStorage = new Storage('mainStorage')
if (!mainStorage.get()) {
  mainStorage.save(false)
}

export default mainStorage