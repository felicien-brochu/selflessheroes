import levellist_music from './music/douce_ambiance.mp3'
import level_music1 from './music/a_coffee_to_go.mp3'
import level_music2 from './music/an_evening_out.mp3'
import level_music3 from './music/better_days.mp3'

import level_lose from './sound/level_lose.mp3'
import level_tests from './sound/level_tests.mp3'
import levellist_star from './sound/levellist_star.mp3'
import levellist_unlock from './sound/levellist_unlock.mp3'

const context = new AudioContext()

const sounds = {
  level_lose: {
    src: level_lose,
    volume: 0.3,
  },
  level_tests: {
    src: level_tests,
    volume: 0.08,
    loop: true,
  },
  level_list_star: {
    src: levellist_star,
    volume: 0.6,
  },
  level_list_unlock: {
    src: levellist_unlock,
    volume: 0.6,
  },
}

const musics = {
  levellist: {
    src: levellist_music,
    volume: 0.5,
    loop: true,
    loopEnd: 48.24,
    loopStart: 3.46,
    start: 1.32,
  },
  level1: {
    src: level_music1,
    volume: 0.2,
  },
  level2: {
    src: level_music2,
    volume: 0.15,
  },
  level3: {
    src: level_music3,
    volume: 0.3,
  },
}

const playlists = {
  levellist: ['levellist'],
  level: ['level1', 'level2', 'level3']
}

class AudioManager {
  constructor(soundConfigs) {
    this.volume = 1
    this.mute = false
    this.volumePreference = null
    this.sounds = new Map()

    for (let configKey in soundConfigs) {
      if (soundConfigs.hasOwnProperty(configKey)) {
        let config = soundConfigs[configKey]
        this.sounds.set(configKey, {
          config: config,
          buffer: null,
          source: null,
          out: null,
        })
      }
    }

    let gainNode = context.createGain()
    gainNode.connect(context.destination)
    this.destination = gainNode

    this.onVolumePreferenceChange = this.onVolumePreferenceChange.bind(this)
  }

  init() {
    for (let [key, sound] of this.sounds) {
      let config = this.sounds.get(key).config
      this.loadConfig(key, config)
    }
  }

  loadConfig(key, config) {
    window.fetch(config.src)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(audioBuffer => this.onLoadSound(key, audioBuffer))
  }

  onLoadSound(key, audioBuffer) {
    this.sounds.get(key).buffer = audioBuffer
  }

  setVolume(volume) {
    this.volume = volume
    this.updateGain()
  }

  setMute(mute) {
    this.mute = mute
    this.updateGain()
  }

  updateGain() {
    let gain = Math.min(Math.max(this.volume, 0), 1)

    if (this.mute) {
      gain = 0
    }
    this.destination.gain.value = gain
  }

  isPlaying(key) {
    let sound = this.sounds.get(key)
    return !!sound && !!sound.source
  }

  stop(key, fade = 0) {
    let sound = this.sounds.get(key)

    if (sound && sound.source) {
      if (fade > 0) {
        sound.out.gain.setValueAtTime(sound.out.gain.value + 0.01, context.currentTime)
        sound.out.gain.exponentialRampToValueAtTime(0.01, context.currentTime + fade)
        sound.source.stop(context.currentTime + fade)
      } else {
        sound.source.stop()
      }
    }
  }

  play(key, additionalConfig = {}, fadeIn = 0) {
    let sound = this.sounds.get(key)

    if (sound && sound.buffer) {
      this.stop(key)
      const source = context.createBufferSource()
      source.buffer = sound.buffer
      let out = source

      let config = {
        ...sound.config,
        ...additionalConfig,
      }

      let gainNode = context.createGain()
      source.connect(gainNode)
      let volume = config.volume || 1
      gainNode.gain.value = volume
      out = gainNode

      source.loop = !!config.loop
      if (config.detune) {
        source.detune = config.detune
      }
      if (config.loopStart) {
        source.loopStart = config.loopStart
      }
      if (config.loopEnd) {
        source.loopEnd = config.loopEnd
      }
      if (config.playbackRate) {
        source.playbackRate = config.playbackRate
      }

      source.addEventListener('ended', (e) => this.onSoundEnded(e, key))

      out.connect(this.destination)
      sound.source = source
      sound.out = out

      let start = 0
      if (config.start) {
        start = config.start
      }

      if (fadeIn > 0) {
        sound.out.gain.setValueAtTime(0.01, context.currentTime)
        sound.out.gain.exponentialRampToValueAtTime(volume, context.currentTime + fadeIn)
      }
      source.start(0, start)

      return true
    }

    return false
  }

  onSoundEnded(e, key) {
    let sound = this.sounds.get(key)

    if (sound) {
      if (sound.out) {
        sound.out.disconnect()
      }
      sound.source = null
      sound.out = null
    }
  }

  setVolumePreference(volumePreference) {
    if (this.volumePreference) {
      this.volumePreference.events.removeListener('change', this.onVolumePreferenceChange)
    }
    this.volumePreference = volumePreference
    this.volumePreference.events.on('change', this.onVolumePreferenceChange)
    this.applyVolumePreference()
  }

  onVolumePreferenceChange() {
    this.applyVolumePreference()
  }

  applyVolumePreference() {
    if (this.volumePreference) {
      this.setVolume(this.volumePreference.volume)
      this.setMute(this.volumePreference.mute)
    }
  }
}

class MusicPlayer extends AudioManager {
  constructor(musicConfigs) {
    super(musicConfigs)

    this.queuedMusic = null
    this.crossFadeDuration = 0.8
  }

  onLoadSound(key, audioBuffer) {
    super.onLoadSound(key, audioBuffer)
    this.tryToPlayQueuedMusic()
  }

  play(key, additionalConfig) {
    this.queuedMusic = null
    let success = true

    if (!this.isPlaying(key)) {
      let playedMusic = this.isMusicPlaying()
      this.stopAll(this.crossFadeDuration)

      success = super.play(key, additionalConfig, this.crossFadeDuration)
      if (!success) {
        this.queuedMusic = {
          key,
          additionalConfig,
        }
      }
    }

    return success
  }

  isMusicPlaying() {
    for (let key of this.sounds.keys()) {
      if (this.isPlaying(key)) {
        return true
      }
    }
    return false
  }

  stopAll(fade = this.crossFadeDuration) {
    for (let [key, sound] of this.sounds) {
      this.stop(key, fade)
    }
  }

  tryToPlayQueuedMusic() {
    if (this.queuedMusic) {
      this.play(this.queuedMusic.key, this.queuedMusic.additionalConfig)
    }
  }
}

class PlaylistPlayer extends MusicPlayer {
  constructor(musicConfigs, playlists) {
    super(musicConfigs)

    this.playlists = playlists
    this.playingPlaylist = null
    this.trackIndex = -1
  }

  playPlaylist(playlistID) {
    let playlist = this.playlists[playlistID]

    if (playlist) {
      this.stopPlaylist()

      this.playingPlaylist = playlist

      this.playNextTrack()
    }
  }

  stopPlaylist() {
    this.trackIndex = -1
    this.playingPlaylist = null
    this.stopAll()
  }

  getNextTrackIndex() {
    let nextTrackIndex = this.trackIndex + 1
    if (nextTrackIndex >= this.playingPlaylist.length) {
      nextTrackIndex = 0
    }

    return nextTrackIndex
  }

  playNextTrack() {
    this.trackIndex = this.getNextTrackIndex()

    if (this.playingPlaylist) {
      this.play(this.playingPlaylist[this.trackIndex])
    }
  }

  onSoundEnded(e, key) {
    super.onSoundEnded(e, key)

    if (this.playingPlaylist && this.playingPlaylist[this.trackIndex] === key) {
      this.playNextTrack()
    }
  }
}

export const soundManager = new AudioManager(sounds)
export const musicManager = new PlaylistPlayer(musics, playlists)