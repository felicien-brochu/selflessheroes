import Phaser from 'phaser'

import CharacterS from './CharacterS'

let heroCreated = 0
let assets = [
  'knight_red',
  'knight_pink',
  'knight_green',
  'knight_blue',
  'knight_purple',
  'knight_orange',
  'knight_dark_blue',
  'knight_white'
]


export default class HeroS extends CharacterS {

  constructor(scene, hero, tileWidth, tileHeight, image) {
    let assetIndex = (Number.isInteger(image) ? image : heroCreated) % assets.length
    super(scene, hero, assets[assetIndex], tileWidth, tileHeight, 0, -21)

    heroCreated++
  }
}