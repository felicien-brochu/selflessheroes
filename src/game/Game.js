import Phaser from 'phaser'
import ParseJSONTiled from 'phaser/src/tilemaps/parsers/tiled/ParseJSONTiled'
import Tilemap from 'phaser/src/tilemaps/Tilemap'
import EventEmitter from 'events'

import lang from '../lang'
import AnimationBuilder from './AnimationBuilder'
import WorldRunner from './WorldRunner'
import CameraControlFactory from './camera/CameraControlFactory'
import SoundManager from './SoundManager'
import Speeds from './Speeds'
import World from '../world/World'
import Direction from '../world/Direction'
import CharacterDeathReason from '../world/objects/CharacterDeathReason'
import {
  tiledObjectToObject,
  namedObjectListToObject
} from '../world/utils'
import Compiler from '../world/ai/compile/Compiler'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import HeroS from './sprites/HeroS'
import NpcS from './sprites/NpcS'
import ObservationS from './sprites/ObservationS'
import DirectionS from './sprites/DirectionS'
import SwitchS from './sprites/SwitchS'
import BonfireS from './sprites/BonfireS'
import CauldronS from './sprites/CauldronS'
import SpikesS from './sprites/SpikesS'
import EggS from './sprites/EggS'
import FireBallS from './sprites/FireBallS'

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
    this.aiFactory = null
    this.onSceneReady = null
    this.followHeroIndex = -1
    this.runner = new WorldRunner()
    this.beforeStep = this.beforeStep.bind(this)
    this.afterStep = this.afterStep.bind(this)
    this.runner.events.on('before-step', this.beforeStep)
    this.runner.events.on('after-step', this.afterStep)
    this.editorWidth = 350
    this.cameraConfig = null

    this.customEvents = new EventEmitter()
  }

  init(data) {
    this.onSceneReady = null

    if (data) {
      this.onSceneReady = data.onGameSceneReady
      this.level = data.level
      this.compilerConfig = this.level.buildCompilerConfig()
    }
  }

  create() {
    AnimationBuilder.build(this)
    this.mapConfig = this.cache.json.get('map')
    this.createMap()

    this.runner.init(this.level, this.mapConfig, this.aiFactory)
    this.world = this.runner.world
    this.createWorld()

    this.initCamera()
    this.initAudio()
    this.initEvents()

    this.createStaticElements()
    this.updateFollowHero()

    if (this.onSceneReady) {
      this.onSceneReady(this)
    }
  }

  beforeDestroy() {
    this.runner.pause()
    this.runner.events.removeListener('before-step', this.beforeStep)
    this.runner.events.removeListener('after-step', this.afterStep)
    this.soundManager.beforeDestroy()
  }

  createMap() {
    this.mapData = ParseJSONTiled('tilemap', this.mapConfig)
    this.map = new Tilemap(this, this.mapData)
    this.tilesetImage = this.map.addTilesetImage('tileset', 'tileset_image')
    this.groundLayer = this.map.createDynamicLayer('ground', this.tilesetImage, 0, 0)
    this.floorShadowLayer = this.map.createDynamicLayer('floor_shadow', this.tilesetImage, 0, 0)

    this.extractCameraConfig()
  }

  extractCameraConfig() {
    const objectLayers = namedObjectListToObject(this.map.objects)
    this.cameraConfig = {
      frame: {
        x: 0,
        y: 0,
        width: this.map.widthInPixels,
        height: this.map.heightInPixels
      },
      strategy: {
        strategy: 'default'
      }
    }

    if (objectLayers.camera) {
      let config = namedObjectListToObject(objectLayers.camera.objects)

      if (config) {
        if (config.frame) {
          this.cameraConfig.frame = tiledObjectToObject(config.frame)
        }
        if (config.strategy) {
          let strategy = tiledObjectToObject(config.strategy)
          this.cameraConfig.strategy = {
            strategy: strategy.strategy
          }
        }
      }
    }
  }

  createStaticElements() {
    this.followCursor = this.add.image(0, 0, 'follow_cursor')
    this.followCursor.setVisible(false)

    this.scene.run('CelebrationScene')

    this.observationSprites = new Map()
    this.directionSprites = new Map()

    for (let dirName of Direction.names) {
      let direction = Direction[dirName]

      let observationSprite = new ObservationS(this, 0, 0, direction, this.map.tileWidth, this.map.tileHeight)
      observationSprite.setVisible(false)
      this.observationSprites.set(dirName, observationSprite)
      this.add.existing(observationSprite)

      let directionSprite = new DirectionS(this, 0, 0, direction, this.map.tileWidth, this.map.tileHeight)
      directionSprite.setVisible(false)
      this.directionSprites.set(dirName, directionSprite)
      this.add.existing(directionSprite)
    }
  }

  createWorld() {
    this.heroes = []
    this.npcs = []
    this.directions = new Map()
    this.observations = new Map()
    this.switches = []
    this.bonfires = []
    this.cauldrons = []
    this.spikes = []
    this.eggs = []
    this.symbols = []

    for (let egg of this.world.eggs) {
      let sprite = new EggS(this, egg, this.map.tileWidth, this.map.tileHeight)
      this.eggs.push(sprite)
      this.add.existing(sprite)
    }

    for (let hero of this.world.heroes) {
      let sprite = new HeroS(this, hero, this.map.tileWidth, this.map.tileHeight)
      this.heroes.push(sprite)
      this.add.existing(sprite)

      sprite.on('step-to', this.updateCharacterDirection, this)
      sprite.on('observe', this.updateCharacterObservations, this)
      sprite.on('die', this.onHeroDeath, this)
      sprite.setInteractive()
      sprite.on('pointerdown', () => this.handleClick(sprite), this)

      this.observations.set(sprite, [])
      this.directions.set(sprite, null)
    }

    for (let npc of this.world.npcs) {
      let sprite = new NpcS(this, npc, this.map.tileWidth, this.map.tileHeight)
      this.npcs.push(sprite)
      this.add.existing(sprite)
    }

    for (let mySwitch of this.world.switches) {
      let sprite = new SwitchS(this, mySwitch, this.map.tileWidth, this.map.tileHeight)
      this.switches.push(sprite)
      this.add.existing(sprite)
    }
    for (let bonfire of this.world.bonfires) {
      let sprite = new BonfireS(this, bonfire, this.map.tileWidth, this.map.tileHeight)
      this.bonfires.push(sprite)
      this.add.existing(sprite)
    }
    for (let cauldron of this.world.cauldrons) {
      let sprite = new CauldronS(this, cauldron, this.map.tileWidth, this.map.tileHeight)
      this.cauldrons.push(sprite)
      this.add.existing(sprite)
    }
    for (let spikes of this.world.spikes) {
      let sprite = new SpikesS(this, spikes, this.map.tileWidth, this.map.tileHeight)
      this.spikes.push(sprite)
      this.add.existing(sprite)
    }
    for (let symbol of this.world.symbols) {
      let sprite = this.add.image((symbol.x + 0.5) * this.map.tileWidth, (symbol.y + 0.5) * this.map.tileHeight, `symbol_${symbol.symbol}`)
      this.symbols.push(sprite)
    }
  }

  restartWorld(rngSeed) {
    this.runner.pause()
    this.destroySprites()

    this.runner.restart(this.level, this.mapConfig, this.aiFactory, rngSeed)
    this.world = this.runner.world
    this.createWorld()
    this.updateFollowHero()
  }

  initCamera() {
    let camera = this.cameras.main
    this.cameraControl = CameraControlFactory.build(
      this.cameraConfig,
      this,
      camera,
      window.innerWidth - 350,
      window.innerHeight,
      this.map.widthInPixels,
      this.map.heightInPixels, {
        top: 80,
        right: 112 + 50,
        bottom: 87 + 80,
        left: 50
      })

    this.cameraControl.init()
  }

  resetCamera() {
    this.cameraControl.init()
  }

  initAudio() {
    this.sound.unlock()
    this.sound.pauseOnBlur = false
    this.soundManager = new SoundManager(this)
  }

  initEvents() {
    this.input.setGlobalTopOnly(false)

    this.input.on('pointerdown', this.handleClickOutside, this)
    this.scale.on('resize', this.handleResize.bind(this))
    this.game.events.on('destroy', this.beforeDestroy.bind(this))
  }

  beforeStep(world) {
    for (let sprite of this.getWorldObjectSprites()) {
      sprite.beforeStep(world)
    }

    this.hideDirectionSprites()
    this.directions.forEach((value, key, map) => map.set(key, null))
    this.hideObservationSprites()
    this.observations.forEach((value, key, map) => map.set(key, []))
  }

  afterStep(world) {
    for (let sprite of this.getWorldObjectSprites()) {
      sprite.afterStep(world)
    }
  }

  playCelebration(nbCelebrations) {
    this.scene.get('CelebrationScene').playCelebration({
      x: 0,
      y: 0,
      w: window.innerWidth - this.editorWidth,
      h: window.innerHeight
    }, nbCelebrations)
  }

  stopCelebration() {
    this.scene.get('CelebrationScene').stopCelebration()
  }

  update(time, delta) {
    this.cameraControl.update(delta)

    for (let sprite of this.getWorldObjectSprites()) {
      sprite.update()
    }

    if (this.followHeroIndex >= 0) {
      let hero = this.heroes[this.followHeroIndex]
      this.followCursor.x = hero.x
      this.followCursor.y = hero.y + 10
      this.followCursor.depth = hero.depth - 1
    }
  }

  getWorldObjectSprites() {
    let sprites = [
      ...this.heroes,
      ...this.npcs,
      ...this.switches,
      ...this.bonfires,
      ...this.cauldrons,
      ...this.spikes,
      ...this.eggs
    ]

    return sprites
  }

  getCharacterSprite(characterID) {
    return this.heroes.find(heroSprite => heroSprite.character.id === characterID)
  }

  getItemSprite(itemID) {
    return this.eggs.find(eggSprite => eggSprite.egg.id === itemID)
  }

  compileAI(code) {
    let compiler = new Compiler(code, this.compilerConfig)
    let oldAIFactory = this.aiFactory
    this.aiFactory = compiler.compile()

    if ((!!this.aiFactory && !oldAIFactory) || (!this.aiFactory && !!oldAIFactory)) {
      this.customEvents.emit('ai-state-change', this.aiReady())
    }
    return compiler.exceptions
  }

  throwFireBall(character, direction) {
    let sprite = new FireBallS(this, character.x + direction.dx, character.y + direction.dy, this.map.tileWidth, this.map.tileHeight)
    sprite.setOrigin(0.5)
    this.add.existing(sprite)
  }

  play() {
    if (this.runner.world.steps === 0) {
      this.restartWorld()
    }
    this.runner.play()
  }

  pause() {
    this.runner.pause()
  }

  togglePlayPause() {
    if (this.runner.isPaused()) {
      this.play()
    } else {
      this.pause()
    }
  }

  stepOnce() {
    if (this.runner.world.steps === 0) {
      this.restartWorld()
    }
    this.runner.doOneStep()
  }

  stop() {
    this.restartWorld()
    this.runner.pause()
  }

  restartWorldWithRngSeed(rngSeed) {
    this.restartWorld(rngSeed)
  }

  startFollowHero(sprite) {
    let heroIndex = -1
    for (let i = 0; i < this.heroes.length; i++) {
      if (sprite === this.heroes[i]) {
        heroIndex = i
        break
      }
    }
    this.emitFollowHeroChange(heroIndex)
  }

  stopFollowHero() {
    this.emitFollowHeroChange(-1)
  }

  setFollowHero(heroIndex) {
    if (heroIndex !== this.followHeroIndex) {
      this.followHeroIndex = heroIndex
    }
    this.updateFollowHero()
  }

  updateFollowHero() {
    this.updateObservations()
    this.updateDirection()
    this.updateFollowCursor()
  }

  updateFollowCursor() {
    let visible = true
    if (this.followHeroIndex >= 0) {
      let sprite = this.heroes[this.followHeroIndex]
      if (sprite.dead && sprite.character.deathReason === CharacterDeathReason.fall) {
        visible = false
      }
    } else {
      visible = false
    }

    this.followCursor.setVisible(visible)
  }

  updateCharacterDirection(character, direction) {
    this.directions.set(character, direction)
    this.updateDirection()
  }

  updateCharacterObservations(character, observations) {
    this.observations.set(character, observations)
    this.updateObservations()
  }

  updateDirection() {
    this.hideDirectionSprites()
    if (this.followHeroIndex >= 0) {
      let hero = this.heroes[this.followHeroIndex]
      let direction = this.directions.get(hero)
      if (direction) {
        let directionSprite = this.directionSprites.get(direction.getName())
        directionSprite.setTilePosition(hero.lastTileX, hero.lastTileY)
        directionSprite.setVisible(true)
      }
    }
  }

  updateObservations() {
    this.hideObservationSprites()
    if (this.followHeroIndex >= 0) {
      let hero = this.heroes[this.followHeroIndex]
      let observations = this.observations.get(hero)
      let x = hero.lastTileX
      let y = hero.lastTileY
      for (let observation of observations) {
        let direction = observation
        let observationSprite = this.observationSprites.get(direction.getName())
        observationSprite.setTilePosition(x, y)
        observationSprite.setVisible(true)
      }
    }
  }

  hideDirectionSprites() {
    this.directionSprites.forEach(sprite => sprite.setVisible(false))
  }

  hideObservationSprites() {
    this.observationSprites.forEach(sprite => sprite.setVisible(false))
  }

  onHeroDeath(hero) {
    // If died hero is the follow hero: update follow hero
    if (this.followHeroIndex >= 0 && hero === this.heroes[this.followHeroIndex]) {
      this.updateFollowHero()
    }
  }

  destroySprites() {
    for (let sprite of this.getWorldObjectSprites()) {
      sprite.destroy()
    }
    for (let symbol of this.symbols) {
      symbol.destroy()
    }
  }

  emitFollowHeroChange(followIndex) {
    this.customEvents.emit('follow-hero-change', followIndex)
  }

  aiReady() {
    return !!this.aiFactory
  }

  setSpeed(speed) {
    this.runner.setSpeed(speed)
  }

  getWorldState() {
    return this.runner ? this.runner.getObservableState() : {}
  }

  getCompilerConfig() {
    return this.compilerConfig
  }

  handleResize(width, height, ratio) {
    this.cameraControl.onResize(window.innerWidth - this.editorWidth, window.innerHeight)
  }

  handleEditorResize(editorWidth) {
    this.editorWidth = editorWidth
    this.cameraControl.onResize(window.innerWidth - this.editorWidth, window.innerHeight)
  }

  handleSpeedChange(speedIndex) {
    this.runner.setSpeed(Speeds.values[speedIndex])
  }

  handleClick(target) {
    if (target instanceof HeroS) {
      this.startFollowHero(target)
    }
    return false
  }

  handleClickOutside(pointer, currentlyOver) {
    if (currentlyOver.length === 0) {
      this.stopFollowHero()
    }
  }
}