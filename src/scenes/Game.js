import Phaser from 'phaser'

import lang from '../lang'
import World from '../game/World'
import HeroS from '../sprites/HeroS'
import ObjectiveS from '../sprites/ObjectiveS'


export default class extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
  }
  init() {}
  preload() {}

  create() {
    this.map = this.make.tilemap({
      key: 'map'
    })

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    this.tiles = this.map.addTilesetImage('DungeonTileset', 'tiles')

    // You can load a layer from the map using the layer name from Tiled, or by using the layer index
    var layer = this.map.createStaticLayer('ground', this.tiles, 1, 2)



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
    this.world = new World(mapObject)
    this.heros = []
    this.objectives = []
    for (let objective of this.world.objectives) {
      let sprite = new ObjectiveS(this, objective, this.map.tileWidth, this.map.tileHeight)
      this.objectives.push(sprite)
      this.add.existing(sprite);
    }
    for (let hero of this.world.heros) {
      let sprite = new HeroS(this, hero, this.map.tileWidth, this.map.tileHeight)
      this.heros.push(sprite)
      this.add.existing(sprite);
    }


    // var spriteKey = 'big_demon'
    // var config = {
    //   key: 'walk',
    //   frames: this.anims.generateFrameNumbers(spriteKey, {
    //     start: 0,
    //     end: 3
    //   }),
    //   frameRate: 4,
    //   yoyo: false,
    //   repeat: -1
    // };

    // var anim = this.anims.create(config);

    // sprite.anims.load('walk');
    // sprite.anims.play('walk');
  }

  initCamera() {
    const xMargin = 100,
      yMargin = 50
    this.cameras.main.setBounds(-xMargin, -yMargin, this.map.widthInPixels + 2 * xMargin, this.map.heightInPixels + 2 * yMargin)
    this.handleResizeCamera(40)

    var cursors = this.input.keyboard.createCursorKeys();
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
    this.cameras.main.setViewport(window.innerWidth * (e / 100), 0,
      window.innerWidth - (window.innerWidth * (e / 100)), window.innerHeight)
  }
}