import storage from '../../game/storage/Storage'

function requestFullscreenDom() {
  return document.body.requestFullscreen()
}

function exitFullscreenDom() {
  return document.exitFullscreen()
}

function isFullscreenEnabledDom() {
  return !!document.fullscreenElement
}

let ipcRenderer
if (IS_ELECTRON) {
  ipcRenderer = require('electron').ipcRenderer
}

function requestFullscreenElectron() {
  ipcRenderer.send('request-fullscreen')
  return Promise.resolve()
}

function exitFullscreenElectron() {
  ipcRenderer.send('exit-fullscreen')
  return Promise.resolve()
}

function isFullscreenEnabledElectron() {
  return ipcRenderer.sendSync('is-fullscreen-enabled')
}

const fullscreenManager = {

  matchPreferences() {
    let fullscreenEnabled = this.isFullscreenEnabled()
    if (IS_ELECTRON && fullscreenEnabled === !!storage.preferences.windowedPreferred) {
      if (fullscreenEnabled) {
        return this.exitFullscreen()
      } else {
        return this.requestFullscreen()
      }
    }
    return Promise.resolve()
  },

  toggleFullscreen() {
    return this.isFullscreenEnabled() ? this.exitFullscreen() : this.requestFullscreen()
  },

  requestFullscreen() {
    storage.preferences.windowedPreferred = false

    if (IS_ELECTRON) {
      return requestFullscreenElectron()
    } else {
      return requestFullscreenDom()
    }
  },

  exitFullscreen() {
    storage.preferences.windowedPreferred = true

    if (IS_ELECTRON) {
      return exitFullscreenElectron()
    } else {
      return exitFullscreenDom()
    }
  },

  isFullscreenEnabled() {
    if (IS_ELECTRON) {
      return isFullscreenEnabledElectron()
    } else {
      return isFullscreenEnabledDom()
    }
  },
}

export default fullscreenManager