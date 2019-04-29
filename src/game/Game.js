import Phaser from 'phaser'
import ParseJSONTiled from 'phaser/src/tilemaps/parsers/tiled/ParseJSONTiled'
import Tilemap from 'phaser/src/tilemaps/Tilemap'
import EventEmitter from 'events'

import lang from '../lang'
import AnimationBuilder from './AnimationBuilder'
import WorldRunner from './WorldRunner'
import CameraControl from './CameraControl'
import Speeds from './Speeds'
import World from '../world/World'
import {
  namedObjectListToObject
} from '../world/utils'
import Compiler from '../world/ai/compile/Compiler'
import CompilerConfig from '../world/ai/compile/CompilerConfig'
import HeroS from './sprites/HeroS'
import ObjectiveS from './sprites/ObjectiveS'

export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
    this.aiFactory = null
    this.compilerConfig = CompilerConfig.getDefault()
    this.onSceneReady = null
    this.followHeroIndex = -1
    this.runner = new WorldRunner()
    this.editorWidth = 385

    this.customEvents = new EventEmitter()
  }

  init(data) {
    this.onSceneReady = null

    if (data) {
      this.onSceneReady = data.onGameSceneReady
      this.level = data.level
    }
  }

  create() {
    AnimationBuilder.build(this)
    this.mapConfig = this.cache.json.get('map')
    this.createMap()

    this.createWorld()
    this.runner.init(this.world)

    this.initCamera()
    this.initEvents()

    this.createStaticElements()
    this.updateFollowHero()

    if (this.onSceneReady) {
      this.onSceneReady(this)
    }
  }

  beforeDestroy() {
    this.runner.pause()
  }

  createMap() {
    this.mapData = ParseJSONTiled('tilemap', this.mapConfig)
    this.map = new Tilemap(this, this.mapData)
    this.tilesetImage = this.map.addTilesetImage('tileset', 'tileset_image')
    this.groundLayer = this.map.createDynamicLayer('ground', this.tilesetImage, 0, 0)
    this.aboveCharacterLayer = this.map.createDynamicLayer('above_characters', this.tilesetImage, 0, 0)
    this.aboveCharacterLayer.depth = 1000000

    this.extractMapFrame()
  }

  extractMapFrame() {
    const objectLayers = namedObjectListToObject(this.map.objects)
    if (!objectLayers.config) {
      throw new Error('there is no "config" object layer in the Tiled json')
    }
    const config = namedObjectListToObject(objectLayers.config.objects)
    if (config.frame) {
      this.mapFrame = {
        x: config.frame.x,
        y: config.frame.y,
        width: config.frame.width,
        height: config.frame.height
      }
    } else {
      this.mapFrame = {
        x: 0,
        y: 0,
        width: this.map.widthInPixels,
        height: this.map.heightInPixels
      }
    }
  }

  createStaticElements() {
    this.followCursor = this.add.image(0, 0, 'follow_cursor')
    this.followCursor.setVisible(false)

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, lang.text('game_over'), {
      font: '64px Roboto',
      fill: '#f5e3d3',
      padding: 30
    })
    this.gameOverText.setVisible(false)
    this.gameOverText.setScrollFactor(0)
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setShadow(0, 1, '#212121', 6)
  }

  createWorld() {
    this.world = new World(this.level, this.mapConfig, this.aiFactory)
    this.heroes = []
    this.objectives = []

    let heroIndex = 0

    for (let hero of this.world.heroes) {
      let sprite = new HeroS(this, hero, this.map.tileWidth, this.map.tileHeight, heroIndex)
      this.heroes.push(sprite)
      sprite.setOrigin(0.5)
      this.add.existing(sprite);
      sprite.setInteractive()
      sprite.on('pointerdown', () => this.handleClick(sprite), this)
      heroIndex++
    }

    for (let objective of this.world.objectives) {
      let sprite = new ObjectiveS(this, objective, this.map.tileWidth, this.map.tileHeight)
      this.objectives.push(sprite)
      this.add.existing(sprite);
    }
  }

  initCamera() {
    let camera = this.cameras.main
    this.cameraControl = new CameraControl(
      this,
      camera,
      window.innerWidth - 385,
      window.innerHeight,
      this.map.widthInPixels,
      this.map.heightInPixels,
      this.mapFrame, {
        top: 80,
        right: 112 + 50,
        bottom: 87 + 80,
        left: 50
      })

    this.cameraControl.init()
  }

  initEvents() {
    this.input.on('pointerdown', this.handleClickOutside, this)
    this.scale.on('resize', this.handleResize.bind(this))
    this.game.events.on('destroy', this.beforeDestroy.bind(this))
  }

  update(time, delta) {
    this.cameraControl.update(delta)

    for (let sprite of this.heroes) {
      sprite.update()
    }
    for (let sprite of this.objectives) {
      sprite.update()
    }

    if (this.followHeroIndex >= 0) {
      let hero = this.heroes[this.followHeroIndex]
      this.followCursor.x = hero.x
      this.followCursor.y = hero.y + 10
      this.followCursor.depth = hero.depth - 1
    }

    if (this.world.gameOver) {
      this.gameOverText.setVisible(true)
    }
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

  restartWorld() {
    this.runner.pause()
    this.destroySprites()
    this.createWorld()
    this.runner.restart(this.world)

    this.gameOverText.setVisible(false)
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
      this.updateFollowHero()
    }
  }

  updateFollowHero() {
    if (this.followHeroIndex >= 0) {
      let sprite = this.heroes[this.followHeroIndex]
      this.cameraControl.startFollow(sprite)
      this.followCursor.setVisible(true)
    } else {
      this.cameraControl.stopFollow()
      this.followCursor.setVisible(false)
    }
  }

  destroySprites() {
    for (let hero of this.heroes) {
      hero.destroy()
    }
    for (let objective of this.objectives) {
      objective.destroy()
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
    this.cameraControl.setVisibleSize(window.innerWidth - this.editorWidth, window.innerHeight)
  }

  handleEditorResize(editorWidth) {
    this.editorWidth = editorWidth
    this.cameraControl.setVisibleSize(window.innerWidth - this.editorWidth, window.innerHeight)
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