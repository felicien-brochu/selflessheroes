import Phaser from 'phaser'

import lang from '../lang'
import AnimationBuilder from './AnimationBuilder'
import WorldRunner from './WorldRunner'
import CameraControl from './CameraControl'
import Speeds from './Speeds'
import World from '../world/World'
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
    this.compilerConfig = CompilerConfig.getDefaultConfig()
    this.onSceneReady = null
    this.followHeroIndex = 0
    this.runner = new WorldRunner()
    this.editorWidth = 400

    this.followHeroListener = null
    this.aiStateListener = null
  }

  init(data) {
    this.onSceneReady = null

    if (data) {
      this.onSceneReady = data.onGameSceneReady
    }
  }

  create() {
    AnimationBuilder.build(this)
    this.mapConfig = this.cache.json.get('map_object')
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

  createMap() {
    this.map = this.make.tilemap({
      key: 'map'
    })
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    this.tiles = this.map.addTilesetImage('tileset', 'tiles')
    // You can load a layer from the map using the layer name from Tiled, or by using the layer index
    this.mapLayer = this.map.createDynamicLayer('ground', this.tiles, 1, 2)
  }

  createStaticElements() {
    this.followCursor = this.add.image(0, 0, 'follow_cursor')
    this.followCursor.setAlpha(0.7)
    this.followCursor.setVisible(false)

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, lang.text('game_over'), {
      font: '64px Menlo',
      fill: '#7b804f',
      padding: 30
    })
    this.gameOverText.setVisible(false)
    this.gameOverText.setScrollFactor(0)
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setShadow(0, 1, '#212121', 6)
  }

  createWorld() {
    this.world = new World(this.mapConfig, this.aiFactory)
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
    this.cameraControl = new CameraControl(this, camera,
      window.innerWidth - 400, window.innerHeight,
      this.map.widthInPixels, this.map.heightInPixels)
    this.cameraControl.init()
  }

  initEvents() {
    this.input.on('pointerdown', this.handleClickOutside, this)
    this.scale.on('resize', this.handleResize.bind(this))
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
      this.followCursor.y = hero.y + 12
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
      this.emitAiStateChange()
    }
    return compiler.exceptions
  }

  play() {
    if (this.runner.steps === 0) {
      this.restartWorld()
    }
    this.runner.play()
  }

  pause() {
    this.runner.pause()
  }

  step() {
    if (this.runner.steps === 0) {
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
      this.cameras.main.startFollow(sprite, false, 0.05, 0.05)
      this.followCursor.setVisible(true)
    } else {
      this.cameras.main.stopFollow()
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

  setFollowHeroListener(listener) {
    this.followHeroListener = listener
  }

  setWorldStateListener(listener) {
    this.runner.setStateListener(listener)
  }

  setAiStateListener(listener) {
    this.aiStateListener = listener
  }

  emitFollowHeroChange(followIndex) {
    if (this.followHeroListener) {
      this.followHeroListener(followIndex)
    }
  }

  emitAiStateChange() {
    if (this.aiStateListener) {
      this.aiStateListener(this.aiReady())
    }
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
    this.startFollowHero(target)
    return false
  }

  handleClickOutside(pointer, currentlyOver) {
    if (currentlyOver.length === 0) {
      this.stopFollowHero()
    }
  }

  handlePlayPause(play) {
    if (play) {
      this.play()
    } else {
      this.pause()
    }
  }
}