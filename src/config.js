import Phaser from 'phaser'

export default {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  // width: 1024,
  // height: 600,
  zoom: 1,
  resolution: 1,
  type: Phaser.AUTO,
  parent: 'world-content',
  localStorageName: 'aiworld'
}