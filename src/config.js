import Phaser from 'phaser'
import MouseWheelToUpDownPlugin from 'phaser3-rex-plugins/plugins/mousewheeltoupdown-plugin.js';


export default {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  zoom: 1,
  resolution: 1,
  type: Phaser.AUTO,
  parent: 'world-content',
  localStorageName: 'aiworld',
  plugins: {
    global: [{
      key: 'rexMouseWheelToUpDown',
      plugin: MouseWheelToUpDownPlugin,
      start: true
    }]
  }
}