import Phaser from 'phaser'
import MouseWheelToUpDown from './MouseWheelToUpDown'

class MouseWheelToUpDownPlugin extends Phaser.Plugins.BasePlugin {

  constructor(pluginManager) {
    super(pluginManager);
  }

  start() {
    var eventEmitter = this.game.events;
    eventEmitter.once('destroy', this.destroy, this);
  }

  add(scene, config) {
    return new MouseWheelToUpDown(scene, config);
  }

}

export default MouseWheelToUpDownPlugin;