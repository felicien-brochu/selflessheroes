import StorageWrapper from './StorageWrapper'
import Career from './Career'


export class Storage extends StorageWrapper {
  constructor(key) {
    super(key)

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

  load(data) {
    this.careers = super.loadIDArray(data.careers, 'careers', Career)
    return true
  }

  toJSON() {
    let o = super.toJSON()
    Object.assign(o, {
      careers: super.toIDArray(this.careers)
    })

    return o
  }
}

const mainStorage = new Storage('mainStorage')
if (!mainStorage.get()) {
  mainStorage.save()
}

export default mainStorage