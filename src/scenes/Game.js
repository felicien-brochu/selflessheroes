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

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, lang.text('game_over'), {
      font: '64px Bangers',
      fill: '#57a900',
      padding: 30
    })
    this.gameOverText.setAlpha(0)
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
      this.add.existing(sprite);
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
    camera.setZoom(0.5)
    // adapt camera viewport according to the editor width
    this.handleResizeCamera(40)
    // center camera
    camera.setScroll(this.map.widthInPixels / 2 - (camera.width / 2), this.map.heightInPixels / 2 - (camera.height / 2))

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
      speed: 0.5
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
    this.cameras.main.startFollow(this.heros[0], false, 0.1, 0.1)
  }

  update(time, delta) {
    this.controls.update(delta);

    for (let sprite of this.heros) {
      sprite.update()
    }
    for (let sprite of this.objectives) {
      sprite.update()
    }

    if (this.world.gameOver) {
      this.gameOverText.setAlpha(1)
    }
  }

  handleResizeCamera(e) {
    this.cameras.main.setViewport(0, 0,
      window.innerWidth - (window.innerWidth * (e / 100)), window.innerHeight)
  }

  runAI(code) {
    this.world.end()
    this.scene.restart({
      aiCode: code
    })
  }
}