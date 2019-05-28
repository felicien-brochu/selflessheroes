import Phaser from 'phaser'

import CharacterS from './CharacterS'

let heroCreated = 0
let assets = [
  'knight_m',
  'elf_m',
  'wizzard_m',
  'knight_f',
  'elf_f',
  'wizzard_f',
]


export default class HeroS extends CharacterS {

  constructor(scene, hero, tileWidth, tileHeight, image) {
    let assetIndex = (Number.isInteger(image) ? image : heroCreated) % assets.length
    super(scene, hero, assets[0], tileWidth, tileHeight, 0, -21)

    heroCreated++
  }
}