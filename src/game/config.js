import Phaser from 'phaser'

import SplashScene from './Splash'
import GameScene from './Game'
import MouseWheelToUpDownPlugin from './plugins/mousewheeltoupdown/mousewheeltoupdown-plugin.js';


export default {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  mode: Phaser.Scale.NO_SCALE,
  zoom: 1,
  resolution: 1,
  type: Phaser.AUTO,
  parent: 'world-content',
  localStorageName: 'aiworld',
  backgroundColor: '#000000',
  plugins: {
    global: [{
      key: 'rexMouseWheelToUpDown',
      plugin: MouseWheelToUpDownPlugin,
      start: true
    }]
  },
  scene: [SplashScene, GameScene]
}