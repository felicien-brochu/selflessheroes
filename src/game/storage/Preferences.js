export default class Preferences {
  constructor(soundVolume, musicVolume, proposeFullscreen = true) {
    if (!soundVolume) {
      soundVolume = new VolumePreference()
    }
    if (!musicVolume) {
      musicVolume = new VolumePreference()
    }
    this.soundVolume = soundVolume
    this.musicVolume = musicVolume
    this.proposeFullscreen = proposeFullscreen
  }

  static buildFromJSON(jsonObject) {
    return new Preferences(
      VolumePreference.buildFromJSON(jsonObject.soundVolume),
      VolumePreference.buildFromJSON(jsonObject.musicVolume),
      jsonObject.proposeFullscreen)
  }
}

class VolumePreference {
  constructor(volume = 1, mute = false) {
    this.volume = volume
    this.mute = mute
  }

  static buildFromJSON(jsonObject) {
    return new VolumePreference(jsonObject.volume, jsonObject.mute)
  }
}