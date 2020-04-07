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

  toggleFullscreen() {
    return this.isFullscreenEnabled() ? this.exitFullscreen() : this.requestFullscreen()
  },

  requestFullscreen: IS_ELECTRON ? requestFullscreenElectron : requestFullscreenDom,
  isFullscreenEnabled: IS_ELECTRON ? isFullscreenEnabledElectron : isFullscreenEnabledDom,
  exitFullscreen: IS_ELECTRON ? exitFullscreenElectron : exitFullscreenDom,
}

export default fullscreenManager