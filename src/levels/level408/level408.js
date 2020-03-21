import map from './map408.json'

const tooMuchHeroesCondition = {
  check() {
    return this.world.heroes.length > 10
  },

  getReason() {
    return 'loss_reason_too_mush_heroes'
  }
}

function generateSpikes(world) {
  const width = world.map.width
  const height = world.map.height

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (world.map.isInfected(j, i) && !world.symbols.find(symbol => symbol.x === j && symbol.y === i)) {
        let spikesConfig = {
          id: world.getAvailableObjectID(),
          x: j,
          y: i,
          triggers: "209",
          enabled: false,
        }
        world.createObject('spikes', spikesConfig)
      }
    }
  }
}

function linkTriggers(world) {
  const xOrigin = 2
  const yOrigin = 5

  let triggers = []
  let triggersNot = []
  const allObjects = world.getAllObjects()

  for (let i = 0; i < 5; i++) {
    let lock = allObjects
      .filter(o => o.y === yOrigin + i && o.x >= xOrigin && o.x < xOrigin + 3)
      .sort((a, b) => a.x - b.x)

    let egg = lock[0]
    let lock1 = lock[1]
    let lock2 = lock[2]
    egg.value = world.rng() > 0.5 ? 1 : 0

    if (egg.value === 0) {
      triggers.push(lock1)
      triggersNot.push(lock2)
    } else {
      triggers.push(lock2)
      triggersNot.push(lock1)
    }
  }

  let spikes = world.findWorldObjectByID(202)
  spikes.triggers = triggers
  spikes.triggersNot = triggersNot
}

const worldGenerator = {
  generate(world) {
    generateSpikes(world)
    linkTriggers(world)
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Infestation",
    fr: "Infestation",
  },
  objective: {
    en: "These little monsters are reproducing at a frightening pace! Stop the infestation before it is too late.\n\n%%icon mdi mdi-alert-octagon-outline$%%Maximum number of heroes: 10",
    fr: "Ces petits monstres se reproduisent à une vitesse affolante\u00A0! Mets fin à l'infestation avant qu'il ne soit trop tard.\n\n%%icon mdi mdi-alert-octagon-outline$%%Nombre maximum de héros\u00A0: 10",
  },
  messages: {
    loss_reason_too_mush_heroes: {
      en: "The maximum number of heroes has been exceeded.\nMaximum number of heroes: 10",
      fr: "Le nombre maximum de héros a été dépassé.\nNombre de héros maximum\u00A0: 10"
    },
    boss_tell: {
      en: "...gnark...gnark...\n...gnark...gnark...gnark...\n...gnark...gnark...",
      fr: "...gnark...gnark...\n...gnark...gnark...gnark...\n...gnark...gnark...",
    },
  },

  maxStep: 600,
  speedTarget: 34,
  lengthTarget: 36,

  bossTellsSomething: true,
  bossName: "chorts",

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'infected', 'wall', 'hole'],
    objectTypes: ['hero', 'npc', 'egg', 'spikes', 'switch', 'nothing'],
    actionFunctions: ['step_once', 'fireball', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 1,
    messages: 8,
    leftComparisonExpressions: ['direction', 'variable'],
    rightComparisonExpressions: ['object_type', 'terrain_type', 'integer']
  },

  ruleset: {
    win: ['all_npc_dead'],
    lose: [tooMuchHeroesCondition, 'or', 'one_hero_dead', 'or', 'default_loss']
  },

  worldGenerator: worldGenerator
}

export default level