import StorageWrapper from './StorageWrapper'
import Preferences from './Preferences'
import Career from './Career'

const storageVersion = '[AIV]{version}[/AIV]'

export class Storage extends StorageWrapper {
  constructor(storageKey) {
    super(storageKey)

    this.version = storageVersion
    this.preferences = new Preferences()
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

    // Safety feature: when no career remove all career keys from local storage
    if (this.careers.length === 0) {
      this.cleanLocalStorage()
    }
  }

  cleanLocalStorage() {
    // Remove all career items from local storage
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)
      if (key.startsWith(`${this.storageKey}.careers`)) {
        localStorage.removeItem(key)
        i--
      }
    }
  }

  load(data) {
    this.version = data.version
    if (data.preferences) {
      this.preferences = Preferences.buildFromJSON(data.preferences)
    } else {
      this.preferences = new Preferences()
    }
    this.careers = super.loadIDArray(data.careers, 'careers', Career)

    if (this.version !== storageVersion) {
      this.migrate()
    }

    return true
  }

  migrate() {}

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      version: this.version,
      preferences: this.preferences,
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