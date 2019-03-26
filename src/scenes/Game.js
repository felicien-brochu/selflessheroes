import Phaser from 'phaser'

import lang from '../lang'
import AnimationBuilder from './AnimationBuilder'
import World from '../game/World'
import HeroS from '../sprites/HeroS'
import ObjectiveS from '../sprites/ObjectiveS'


export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
    this.aiCode = null
  }

  init(data) {
    this.aiCode = null
    if (data && data.aiCode) {
      this.aiCode = data.aiCode
    }
  }

  create() {
    AnimationBuilder.build(this)

    this.map = this.make.tilemap({
      key: 'map'
    })

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    this.tiles = this.map.addTilesetImage('DungeonTileset', 'tiles')

    // You can load a layer from the map using the layer name from Tiled, or by using the layer index
    var layer = this.map.createDynamicLayer('ground', this.tiles, 1, 2)
    this.createWorld(this.cache.json.get('map_object'))

    this.initCamera()
    this.initEvents()

    this.followCursor = this.add.image(0, 0, 'follow_cursor')
    this.followCursor.setAlpha(0.7)
    this.followCursor.setVisible(false)

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, lang.text('game_over'), {
      font: '64px Bangers',
      fill: '#57a900',
      padding: 30
    })
    this.gameOverText.setVisible(false)
    this.gameOverText.setScrollFactor(0)
    this.gameOverText.setOrigin(0.5)

    this.world.play()
  }

  createWorld(mapObject) {
    this.world = new World(mapObject, this.aiCode)
    this.heros = []
    this.objectives = []
    for (let hero of this.world.heros) {
      let sprite = new HeroS(this, hero, this.map.tileWidth, this.map.tileHeight)
      this.heros.push(sprite)
      sprite.setOrigin(0.5)
      this.add.existing(sprite);
      sprite.setInteractive()
      sprite.on('pointerdown', () => this.handleClick(sprite), this)
    }
    for (let objective of this.world.objectives) {
      let sprite = new ObjectiveS(this, objective, this.map.tileWidth, this.map.tileHeight)
      this.objectives.push(sprite)
      this.add.existing(sprite);
    }
  }

  initCamera() {
    const xMargin = 100,
      yMargin = 50
    let camera = this.cameras.main
    camera.setBounds(-xMargin, -yMargin, this.map.widthInPixels + 2 * xMargin, this.map.heightInPixels + 2 * yMargin)
    camera.setZoom(1)
    // adapt camera viewport according to the editor width
    this.handleResizeCamera(40)
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
  }

  follow(sprite) {
    this.cameras.main.startFollow(sprite, false, 0.05, 0.05)
    this.followSprite = sprite
    this.followCursor.setVisible(true)
  }

  stopFollow() {
    this.cameras.main.stopFollow()
    this.followSprite = null
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

    if (this.followSprite) {
      this.followCursor.x = this.followSprite.x
      this.followCursor.y = this.followSprite.y + 6
      this.followCursor.depth = this.followSprite.depth - 1
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

  handleResizeCamera(e) {
    this.cameras.main.setViewport(0, 0,
      window.innerWidth - (window.innerWidth * (e / 100)), window.innerHeight)
  }

  handleClick(target) {
    this.follow(target)
    return false
  }

  handleClickOutside(pointer, currentlyOver) {
    if (currentlyOver.length === 0) {
      this.stopFollow()
    }
  }

  runAI(code) {
    this.world.end()
    this.scene.restart({
      aiCode: code
    })
  }
}