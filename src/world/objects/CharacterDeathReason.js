export default class CharacterDeathReason {}

CharacterDeathReason.fall = Symbol('fallCharacterDeathReason')
CharacterDeathReason.spikes = Symbol('spikesCharacterDeathReason')
CharacterDeathReason.burnt = Symbol('burntCharacterDeathReason')
CharacterDeathReason.touchedEnemy = Symbol('touchedEnemyCharacterDeathReason')
CharacterDeathReason.failedCloning = Symbol('failedCloningCharacterDeathReason')

Object.freeze(CharacterDeathReason)