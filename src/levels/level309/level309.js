import map from './map309.json'

const winCondition = {
  check() {
    return this.world.heroes.every(hero => hero.x >= 11)
  },
}


const level = {
  mapConfig: map,
  name: {
    en: "The mad gatekeeper",
    fr: "Le gardien fou",
  },
  objective: {
    en: "Move the heros from the left, all the way to the right.",
    fr: "Déplace les héros de gauche jusqu'au bord droit.",
  },
  messages: {
    boss_tell: {
      en: "...it's open!\n...ha ha ha ha... it's closed!\nit's open! it's closed!\n...ha ha ha ha...",
      fr: "...c'est ouvert\u00A0!\n...ha ha ha ha... c'est fermé\u00A0!\nc'est ouvert\u00A0! c'est fermé\u00A0!\n...ha ha ha ha...",
    },
  },

  maxStep: 600,
  speedTarget: 107,
  lengthTarget: 27,

  bossTellsSomething: true,
  bossName: "big-zombie",

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall'],
    objectTypes: ['hero', 'npc', 'switch', 'spikes', 'nothing'],
    actionFunctions: ['step_once', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
    forbiddenExpressions: ['myitem'],
  },

  ruleset: {
    win: [winCondition],
    lose: ['one_hero_dead', 'or', 'default_loss']
  },
}

export default level