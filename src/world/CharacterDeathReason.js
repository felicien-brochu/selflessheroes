export default class CharacterDeathReason {}

CharacterDeathReason.fall = Symbol('fallCharacterDeathReason')
CharacterDeathReason.burnt = Symbol('burntCharacterDeathReason')

Object.freeze(CharacterDeathReason)