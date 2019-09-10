import LightableS from './LightableS'

export default class BonfireS extends LightableS {
  constructor(scene, bonfire, tileWidth, tileHeight, offsetX = 0, offsetY = -23) {
    super(scene, bonfire, tileWidth, tileHeight, offsetX, offsetY, 'bonfire', 'bonfire_on', 'bonfire_off')
  }
}