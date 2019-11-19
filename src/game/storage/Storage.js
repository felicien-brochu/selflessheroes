import StorageWrapper from './StorageWrapper'
import Preferences from './Preferences'
import Career from './Career'
import {
  saveAs
} from 'file-saver'

const storageVersion = '[AIV]{version}[/AIV]'

export class Storage extends StorageWrapper {
  constructor(storageKey) {
    super(storageKey)

    this.version = storageVersion
    this.isPremium = false
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

  saveCareerFile(careerID) {
    let career = this.getCareer(careerID)
    let savedObject = {
      version: storageVersion,
      career: career,
    }

    career.discardToJSON()
    let savedString = JSON.stringify(savedObject)
    career.restoreToJSON()

    var blob = new Blob([savedString], {
      type: "application/selflessheroes;charset=utf-8"
    })
    saveAs(blob, `Selfless Heroes - ${career.name}.shsv`)
  }

  activatePremium(activationKey) {
    if (this.checkActivationKey(activationKey)) {
      this.isPremium = true
      this.save()
      return true
    } else {
      return false
    }
  }

  checkActivationKey(activationKey) {
    let key = activationKey.replace(/[^0-9]/g, '')
    if (key.length !== 11) {
      return false
    }
    let a = parseInt(key.substring(0, 3))
    let b = parseInt(key.substring(3, 6))
    let c = parseInt(key.substring(6, 9))
    let d = parseInt(key.substring(9, 11))

    if (a === 0 || b === 0 || c === 0 || d === 0) {
      return false
    }

    let res = ((a + c) * b) % 83 + 5

    if (res !== d) {
      return false
    }

    return true
  }

  loadSavedCareer(json) {
    let savedJSON = JSON.parse(json)
    let careerJSON = savedJSON.career

    const id = StorageWrapper.getAvailableID(this.careers)
    const career = new Career(`${this.storageKey}.careers[${id}]`)
    career.set(id)
    career.importFromSaved(careerJSON)
    this.careers.push(career)

    this.save(false)

    return career
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
    this.isPremium = !!data.isPremium
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

  migrate() {
    this.version = storageVersion
    this.save()
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      version: this.version,
      isPremium: !!this.isPremium,
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