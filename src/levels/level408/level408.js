import map from './map408.json'

const winCondition = {
  beforeStart() {},

  check() {
    let spikes = this.world.findWorldObjectByID(202)
    return false
  }
}

const tooMuchHeroesCondition = {
  check() {
    return this.world.heroes.length > 10
  },

  getReason() {
    return 'loss_reason_too_mush_heroes'
  }
}

function generateSpikes(world) {
  const width = 20
  const height = 5

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (Math.floor(j / 4) > i - 1) {
        let spikesConfig = {
          id: world.getAvailableObjectID(),
          x: j + 2,
          y: i + 2,
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
    en: "Put the %%icon icon-egg$%% egg of maximum value into the %%icon icon-cauldron$%% cauldron.\n\n%%icon mdi mdi-alert-octagon-outline$%%Maximum number of heroes: 10",
    fr: "Mets l' %%icon icon-egg$%% œuf de valeur maximum dans le %%icon icon-cauldron$%% chaudron.\n\n%%icon mdi mdi-alert-octagon-outline$%%Nombre maximum de héros\u00A0: 10",
  },

  messages: {
    loss_reason_too_mush_heroes: {
      en: "The maximum number of heroes has been exceeded.\nMaximum number of heroes: 10",
      fr: "Le nombre maximum de héros a été dépassé.\nNombre de héros maximum\u00A0: 10"
    },
  },

  maxStep: 600,
  speedTarget: 117,
  lengthTarget: 45,

  compilerConfig: {
    excludePrimary: [],
    cloneIsDeadly: false,
    terrainTypes: ['floor', 'infected', 'wall', 'hole'],
    objectTypes: ['hero', 'npc', 'egg', 'spikes', 'switch', 'nothing'],
    actionFunctions: ['step_once', 'fireball', 'tell', 'listen'],
    valueFunctions: ['set', 'calc'],
    variables: 4,
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