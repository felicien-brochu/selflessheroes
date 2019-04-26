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
      storages.push(new storageClass(storageKey))
    }

    return storages
  }

  save(deep = true) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(this))

    if (deep) {
      for (let saveableObject of this.getSaveables()) {
        saveableObject.save()
      }
    }
  }

  clear(deep = true) {
    if (deep) {
      for (let saveableObject of this.getSaveables()) {
        saveableObject.clear(true)
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

  getSaveables() {
    let saveables = []
    for (let key in this) {
      let prop = this[key]
      if (prop instanceof StorageWrapper) {
        saveables.push(prop)
      } else if (Array.isArray(prop)) {
        for (let item of prop) {
          if (item instanceof StorageWrapper) {
            saveables.push(item)
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