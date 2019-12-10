import map from './map212.json'

const winCondition = {
  beforeStart() {},

  check() {
    return this.world.cauldrons[0].items.length === this.world.eggs.length
  }
}

const level = {
  mapConfig: map,
  name: {
    en: "Maze",
    fr: "Labyrinthe",
  },
  objective: {
    en: "Put all the %%icon icon-egg$%% eggs into the %%icon icon-cauldron$%% cauldron.\n\n%%icon mdi mdi-information-outline$%% It's always a little tricky to find your way through a maze... Fortunately now you can use %%statement assign-statement$nearest%% to find your way.",
    fr: "Mets tous les %%icon icon-egg$%% œufs dans le %%icon icon-cauldron$%% chaudron.\n\n%%icon mdi mdi-information-outline$%% C'est toujours un peu délicat de s'orienter dans un labyrinthe... Heureusement maintenant tu peux utiliser %%statement assign-statement$plus proche%% pour trouver ton chemin.",
  },

  maxStep: 100,
  speedTarget: 34,
  lengthTarget: 2,

  compilerConfig: {
    excludePrimary: ['if', 'else', 'endif', 'jump', 'anchor', 'clone'],
    terrainTypes: ['wall', 'floor', 'hole'],
    objectTypes: ['cauldron', 'egg', 'hero'],
    actionFunctions: ['drop'],
    valueFunctions: ['nearest'],
    variables: 1,
  },

  ruleset: {
    win: [winCondition],
    lose: 'default_loss'
  },
}

export default level