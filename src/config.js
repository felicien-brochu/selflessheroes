import Phaser from 'phaser'

export default {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  zoom: 1,
  resolution: 1,
  type: Phaser.AUTO,
  parent: 'content',
  localStorageName: 'aiworld'
}