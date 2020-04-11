import Phaser from 'phaser'

import SplashScene from './Splash'
import GameScene from './Game'
import CelebrationScene from './Celebration'
import MouseWheelToUpDownPlugin from './plugins/mousewheeltoupdown/mousewheeltoupdown-plugin.js';


export default () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  scale: {
    mode: Phaser.Scale.NONE
  },
  zoom: 1,
  resolution: 1,
  type: Phaser.AUTO,
  parent: 'world-content',
  localStorageName: 'selflessheroes',
  backgroundColor: 'rgba(0, 0, 0, 0)',
  plugins: {
    global: [{
      key: 'rexMouseWheelToUpDown',
      plugin: MouseWheelToUpDownPlugin,
      start: true
    }]
  },
  scene: [SplashScene, GameScene, CelebrationScene]
})