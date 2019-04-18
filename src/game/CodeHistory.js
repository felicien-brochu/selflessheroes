const maxDepth = 200

export default class CodeHistory {
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey

    this.revisions = ['']
    this.activeRevision = 0

    if (!storageAvailable('localStorage')) {
      throw new Error('local storage unavailable')
    }
  }

  static loadOrCreate(localStorageKey) {
    let codeHistory = new CodeHistory(localStorageKey)
    if (!codeHistory.load()) {
      codeHistory.save()
    }
    return codeHistory
  }

  load() {
    let historyJson = window.localStorage.getItem(this.localStorageKey)
    if (historyJson === null) {
      return false
    }

    let historyData = JSON.parse(historyJson)

    this.revisions = historyData.revisions
    this.activeRevision = historyData.activeRevision
  }

  save() {
    let historyJson = JSON.stringify(this, (key, value) => {
      if (key === 'localStorageKey') {
        return undefined
      }
      return value
    })

    window.localStorage.setItem(this.localStorageKey, historyJson)
  }

  push(code, save = true) {
    this.activeRevision++
    this.revisions.splice(this.activeRevision, this.revisions.length - this.activeRevision, code)

    if (this.revisions.length > maxDepth) {
      let newStart = this.revisions.length - maxDepth
      this.activeRevision -= newStart
      this.revisions = this.revisions.slice(newStart)
    }

    if (save) {
      this.save()
    }
  }

  undo(save = true) {
    if (this.activeRevision <= 0) {
      throw new Error('there is no more code history revision to undo')
    }

    this.activeRevision--
    if (save) {
      this.save()
    }

    return this.getCode()
  }

  canUndo() {
    return this.activeRevision > 0
  }

  redo(save = true) {
    if (this.activeRevision >= this.revisions.length - 1) {
      throw new Error('there is no code history revision to redo')
    }

    this.activeRevision++
    if (save) {
      this.save()
    }

    return this.getCode()
  }

  canRedo() {
    return this.activeRevision < this.revisions.length - 1
  }

  getCode(index = 0) {
    let revisionIndex = this.activeRevision + index
    if (revisionIndex < 0 || revisionIndex >= this.revisions.length) {
      return null
    }
    return this.revisions[revisionIndex]
  }

}

function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}