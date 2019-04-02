import Phaser from 'phaser'

import lang from '../lang'
import AnimationBuilder from './AnimationBuilder'
import WorldRunner from './WorldRunner'
import Speeds from './Speeds'
import World from '../game/World'
import Compiler from '../game/ai/compile/Compiler'
import HeroS from '../sprites/HeroS'
import ObjectiveS from '../sprites/ObjectiveS'


export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
    this.aiCode = ''
    this.onSceneReady = null
    this.followHeroIndex = -1
    this.runner = new WorldRunner()
  }

  init(data) {
    this.aiCode = ''
    this.onSceneReady = null

    if (data) {
      if (data.aiCode) {
        this.aiCode = data.aiCode
      }
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
    this.tiles = this.map.addTilesetImage('DungeonTileset', 'tiles')
    // You can load a layer from the map using the layer name from Tiled, or by using the layer index
    this.mapLayer = this.map.createDynamicLayer('ground', this.tiles, 1, 2)
  }

  createStaticElements() {
    this.followCursor = this.add.image(0, 0, 'follow_cursor')
    this.followCursor.setAlpha(0.7)
    this.followCursor.setVisible(false)

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, lang.text('game_over'), {
      font: '64px Bangers',
      fill: '#7b804f',
      padding: 30
    })
    this.gameOverText.setVisible(false)
    this.gameOverText.setScrollFactor(0)
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.setShadow(0, 1, '#212121', 6)
  }

  createWorld() {
    let compiler = new Compiler(this.aiCode)
    let aiFactory = compiler.compile()
    this.world = new World(this.mapConfig, aiFactory)
    this.heros = []
    this.objectives = []

    let heroIndex = 0

    for (let hero of this.world.heros) {
      let sprite = new HeroS(this, hero, this.map.tileWidth, this.map.tileHeight, heroIndex)
      this.heros.push(sprite)
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
    const xMargin = 100
    const yMargin = 50
    let camera = this.cameras.main
    camera.setBounds(-xMargin, -yMargin, this.map.widthInPixels + 2 * xMargin, this.map.heightInPixels + 2 * yMargin)
    camera.setZoom(1)
    // center camera
    camera.setScroll(this.map.widthInPixels / 2 - (camera.width / 2), this.map.heightInPixels / 2 - (camera.height / 2))
    this.mouseWheelToUpDown = this.plugins.get('rexMouseWheelToUpDown').add(this)
    var cursorKeys = this.mouseWheelToUpDown.createCursorKeys()
    var cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT
    })
    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: cursorKeys.down,
      zoomOut: cursorKeys.up,
      zoomSpeed: 0.1,
      speed: {
        x: 0.5,
        y: 0.5
      }
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
  }

  initEvents() {
    this.input.on('pointerdown', this.handleClickOutside, this)
    this.scale.on('resize', this.handleResize.bind(this))
  }

  startFollowHero(sprite) {
    let heroIndex = -1
    for (let i = 0; i < this.heros.length; i++) {
      if (sprite === this.heros[i]) {
        heroIndex = i
        break
      }
    }
    if (heroIndex >= 0) {
      this.cameras.main.startFollow(sprite, false, 0.05, 0.05)
      this.followHeroIndex = heroIndex
      this.followCursor.setVisible(true)
    }
  }

  stopFollowHero() {
    this.cameras.main.stopFollow()
    this.followHeroIndex = -1
    this.followCursor.setVisible(false)
  }

  update(time, delta) {
    this.updateCamera(time, delta)

    for (let sprite of this.heros) {
      sprite.update()
    }
    for (let sprite of this.objectives) {
      sprite.update()
    }

    if (this.followHeroIndex >= 0) {
      let hero = this.heros[this.followHeroIndex]
      this.followCursor.x = hero.x
      this.followCursor.y = hero.y + 6
      this.followCursor.depth = hero.depth - 1
    }

    if (this.world.gameOver) {
      this.gameOverText.setVisible(true)
    }
  }

  updateCamera(time, delta) {
    this.controls.update(delta);
    let camera = this.cameras.main

    if (this.input.activePointer.isDown) {
      if (this.origDragPoint) { // move the camera by the amount the mouse has moved since last update
        camera.scrollX += this.origDragPoint.x - this.input.activePointer.position.x;
        camera.scrollY += this.origDragPoint.y - this.input.activePointer.position.y;
      } // set new drag origin to current position
      this.origDragPoint = this.input.activePointer.position.clone();
    } else {
      this.origDragPoint = null;
    }
  }

  resizeCameraViewport() {
    this.cameras.main.setViewport(0, 0, window.innerWidth - this.editorWidth, window.innerHeight)
  }

  play() {
    this.runner.play()
  }

  pause() {
    this.runner.pause()
  }

  restartWorld(aiCode = this.aiCode) {
    this.runner.pause()
    this.aiCode = aiCode
    this.destroySprites()
    this.createWorld()
    this.runner.restart(this.world)

    if (this.followHeroIndex >= 0) {
      this.startFollowHero(this.heros[this.followHeroIndex])
    }

    this.gameOverText.setVisible(false)
  }

  destroySprites() {
    for (let hero of this.heros) {
      hero.destroy()
    }
    for (let objective of this.objectives) {
      objective.destroy()
    }
  }

  setWorldStateListener(listener) {
    this.runner.setStateListener(listener)
  }

  handleResize(width, height, ratio) {
    this.resizeCameraViewport()
  }

  handleEditorResize(editorWidth) {
    this.editorWidth = editorWidth
    this.resizeCameraViewport()
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

  compileAI(code) {
    let compiler = new Compiler(code)
    let aiFactory = compiler.compile()
    return compiler.exception
  }

  runAI(code) {
    this.restartWorld(code)
    this.runner.pause()
  }

  setSpeed(speed) {
    this.runner.setSpeed(speed)
  }

  getWorldState() {
    return this.runner ? this.runner.getObservableState() : {}
  }

  step() {
    if (this.runner.isPaused()) {
      this.runner.doOneStep()
    } else {
      this.runner.pause()
    }
  }

  stop() {
    this.restartWorld()
    this.runner.pause()
  }
}