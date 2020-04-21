import EventEmitter from 'events'

export default class Preferences {
  constructor(soundVolume, musicVolume, language, windowedPreferred = false, proposeFullscreen = true, warnLocalStorage = true) {
    this.events = new EventEmitter()

    if (!soundVolume) {
      soundVolume = new VolumePreference()
    }
    if (!musicVolume) {
      musicVolume = new VolumePreference()
    }
    this.soundVolume = soundVolume
    this.musicVolume = musicVolume
    this.language = language
    this.windowedPreferred = windowedPreferred
    this.proposeFullscreen = proposeFullscreen
    this.warnLocalStorage = warnLocalStorage
  }

  get soundVolume() {
    return this._soundVolume
  }

  set soundVolume(soundVolume) {
    if (soundVolume !== this._soundVolume) {
      soundVolume.events.on('change', () => this.events.emit('change', 'soundVolume'))
      this._soundVolume = soundVolume
      this.events.emit('change', 'soundVolume')
    }
  }

  get musicVolume() {
    return this._musicVolume
  }

  set musicVolume(musicVolume) {
    if (musicVolume !== this._musicVolume) {
      musicVolume.events.on('change', () => this.events.emit('change', 'musicVolume'))
      this._musicVolume = musicVolume
      this.events.emit('change', 'musicVolume')
    }
  }

  get language() {
    return this._language
  }

  set language(language) {
    if (language !== this._language) {
      this._language = language
      this.events.emit('change', 'language')
    }
  }

  get windowedPreferred() {
    return this._windowedPreferred
  }

  set windowedPreferred(windowedPreferred) {
    this._windowedPreferred = windowedPreferred
    this.events.emit('change', 'windowedPreferred')
  }

  get proposeFullscreen() {
    return this._proposeFullscreen
  }

  set proposeFullscreen(proposeFullscreen) {
    this._proposeFullscreen = proposeFullscreen
    this.events.emit('change', 'proposeFullscreen')
  }

  get warnLocalStorage() {
    return this._warnLocalStorage
  }

  set warnLocalStorage(warnLocalStorage) {
    this._warnLocalStorage = warnLocalStorage
    this.events.emit('change', 'warnLocalStorage')
  }

  toJSON() {
    return {
      soundVolume: this.soundVolume,
      musicVolume: this.musicVolume,
      language: this.language,
      windowedPreferred: this.windowedPreferred,
      proposeFullscreen: this.proposeFullscreen,
      warnLocalStorage: this.warnLocalStorage,
    }
  }

  static buildFromJSON(jsonObject) {
    return new Preferences(
      VolumePreference.buildFromJSON(jsonObject.soundVolume),
      VolumePreference.buildFromJSON(jsonObject.musicVolume),
      jsonObject.language,
      jsonObject.windowedPreferred,
      jsonObject.proposeFullscreen,
      jsonObject.warnLocalStorage)
  }
}

class VolumePreference {
  constructor(volume = 1, mute = false) {
    this.events = new EventEmitter()

    this.volume = volume
    this.mute = mute
  }

  get volume() {
    return this._volume
  }

  set volume(volume) {
    this._volume = volume
    this.events.emit('change', 'volume')
  }

  get mute() {
    return this._mute
  }

  set mute(mute) {
    this._mute = mute
    this.events.emit('change', 'mute')
  }

  toJSON() {
    return {
      volume: this.volume,
      mute: this.mute
    }
  }

  static buildFromJSON(jsonObject) {
    return new VolumePreference(jsonObject.volume, jsonObject.mute)
  }
}