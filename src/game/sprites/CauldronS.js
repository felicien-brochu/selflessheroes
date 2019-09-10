import LightableS from './LightableS'

export default class CauldronS extends LightableS {
  constructor(scene, cauldron, tileWidth, tileHeight, offsetX = 0, offsetY = -9) {
    super(scene, cauldron, tileWidth, tileHeight, offsetX, offsetY, 'cauldron', 'cauldron_on', 'cauldron_off')
  }
}