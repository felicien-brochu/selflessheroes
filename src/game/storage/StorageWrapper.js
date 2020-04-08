export default class StorageWrapper {
  constructor(storageKey) {
    this.storageKey = storageKey
    this.loaded = false
  }

  get() {
    if (!this.loaded) {
      let data = this.retrieveStorageData()
      if (!data || !this.load(data)) {
        return null
      }
    }
    this.loaded = true
    return this
  }

  set(...args) {
    this.init(...args)
    this.loaded = true
  }

  retrieveStorageData() {
    let data = window.localStorage.getItem(this.storageKey)
    if (!data) {
      return null
    }
    return JSON.parse(data)
  }

  loadIDArray(ids, arrayKey, storageClass) {
    let storages = []

    for (let id of ids) {
      let storageKey = `${this.storageKey}.${arrayKey}[${id}]`
      let storage = new storageClass(storageKey)
      storages.push(storage.get())
    }

    return storages
  }

  save(deep = false) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this))
    // console.debug("STORAGE SAVE: ", this.id, this.constructor.name, JSON.stringify(this, null, '\t'))
    if (deep) {
      for (let saveableObject of this.getSaveables()) {
        saveableObject.save(deep)
      }
    }
  }

  clear(deep = true) {
    if (deep) {
      for (let saveableObject of this.getSaveables()) {
        saveableObject.get().clear(true)
      }
    }
    window.localStorage.removeItem(this.storageKey)
  }

  toIDArray(array) {
    return array.map(item => item.id)
  }

  toJSON() {
    return {}
  }

  discardToJSON() {
    this.discardedToJSON = this.toJSON
    this.toJSON = () => {
      let json = {}
      Object.assign(json, this)
      json.loaded = undefined
      json.storageKey = undefined

      return json
    }

    for (let saveableObject of this.getSaveables()) {
      saveableObject.get().discardToJSON()
    }
  }

  restoreToJSON() {
    this.toJSON = this.discardedToJSON
    this.discardedToJSON = undefined
    for (let saveableObject of this.getSaveables()) {
      saveableObject.get().restoreToJSON()
    }
  }

  getSaveables() {
    let saveables = []
    for (let key in this) {
      let prop = this[key]
      if (prop) {
        if (prop instanceof StorageWrapper) {
          saveables.push(prop)
        } else if (Array.isArray(prop)) {
          for (let item of prop) {
            if (item && item instanceof StorageWrapper) {
              saveables.push(item)
            }
          }
        }
      }
    }
    return saveables
  }

  static getAvailableID(storageArray) {
    let max = -1
    storageArray.forEach(s => {
      max = Math.max(s.id, max)
    })
    return max + 1
  }
}