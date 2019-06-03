import Phaser from 'phaser'

import CharacterS from './CharacterS'

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
  constructor(scene, hero, tileWidth, tileHeight) {
    super(scene, hero, assets[hero.color], tileWidth, tileHeight, 0, -21)
  }
}