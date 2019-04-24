import Phaser from 'phaser'

import CharacterS from './CharacterS'

let heroCreated = 0
let assets = [
  'elf_m',
  'knight_m',
  'wizzard_m',
  'elf_f',
  'knight_f',
  'wizzard_f',
]


export default class HeroS extends CharacterS {

  constructor(scene, hero, tileWidth, tileHeight, image) {
    let assetIndex = (Number.isInteger(image) ? image : heroCreated) % assets.length
    super(scene, hero, assets[assetIndex], tileWidth, tileHeight, 0, -23)

    heroCreated++
  }
}