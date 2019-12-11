import map from './map211.json'

const worldGenerator = {
  generate(world) {
    let originMarker = world.findConfigObjectByID(479)

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let x = originMarker.x + j
        let y = originMarker.y + i * 2
        let eggConfig = {
          id: world.getAvailableObjectID(),
          x: x,
          y: y,
          value: 0,
        }
        world.createObject('egg', eggConfig)
      }
    }
  }
}


const level = {
  mapConfig: map,
  name: {
    en: "Kronos",
    fr: "Kronos",
  },
  objective: {
    en: "Looks like he's starving. You better give him what he wants before he gets angry...",
    fr: "On dirait qu'il est affamé. Tu ferais bien de lui donner ce qu'il veut avant qu'il ne s'énerve...",
  },
  messages: {
    boss_tell: {
      en: "...give me...\n...give me food...\nalways more\u00A0! ALWAYS MORE\u00A0!",
      fr: "...donne moi...\n...donne moi à manger...\ntoujours plus\u00A0! TOUJOURS PLUS\u00A0!",
    },
  },

  maxStep: 600,
  speedTarget: 93,
  lengthTarget: 23,

  bossTellsSomething: true,
  bossName: "kronos",

  compilerConfig: {
    excludePrimary: ['clone'],
    terrainTypes: ['floor', 'wall', 'hole'],
    objectTypes: ['egg', 'hero', 'npc', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop', 'write'],
    valueFunctions: ['set', 'calc'],
    variables: 6,
    messages: 8,
    leftComparisonExpressions: ['direction', 'variable'],
    rightComparisonExpressions: ['terrain_type', 'object_type', 'integer'],
    forbiddenExpressions: ['myitem'],
  },

  ruleset: {
    win: ['all_npc_dead'],
    lose: ['all_hero_dead', 'or', 'too_many_steps']
  },

  worldGenerator: worldGenerator
}

export default level