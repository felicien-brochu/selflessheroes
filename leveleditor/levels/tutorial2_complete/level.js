module.exports = {
  mapConfig: MAP_CONFIG,

  messages: {
    "en": {
      "name": "Black forest",
      "objective": "Put the %%icon icon-egg$%% egg of highest value into the %%icon icon-cauldron$%% cauldron.\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: don't put any other %%icon icon-egg$%% egg into the %%icon icon-cauldron$%% cauldron.",
      "loss_reason_wrong_egg_in_cauldron": "You put an %%icon icon-egg$%% egg which is not of highest value into the %%icon icon-cauldron$%% cauldron."
    },
    "fr": {
      "name": "Forêt noire",
      "objective": "Mets l'%%icon icon-egg$%% œuf de valeur maximale dans le %%icon icon-cauldron$%% chaudron.\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: ne mets pas d'autre %%icon icon-egg$%% œuf dans le %%icon icon-cauldron$%% chaudron.",
      "loss_reason_wrong_egg_in_cauldron": "Tu as mis un %%icon icon-egg$%% œuf qui n'est pas le maximum dans le %%icon icon-cauldron$%% chaudron."
    }
  },

  lengthTarget: 21,
  speedTarget: 85, //< Set to the value given by the failed test

  maxStep: 350, //< Approximately 4 * speedTarget
  deterministic: false, //< This level uses randomness

  compilerConfig: {
    // Exclude clone and assign statements from the language
    excludePrimary: ['clone', 'assign'],
    // There is no use for variables in this level e.g. no use for value functions (set, calc, nearest)
    valueFunctions: [],
    // Available action functions
    actionFunctions: ['step', 'take', 'drop', 'tell', 'listen'],
    // expression types available for the right part of if comparisons
    leftComparisonExpressions: ['direction', 'myitem'],
    // expression types available for the left part of if comparisons
    rightComparisonExpressions: ['direction', 'myitem', 'terrain_type', 'object_type'],
    // available terrain types
    terrainTypes: ['floor', 'wall', 'hole'],
    // available object types
    objectTypes: ['egg', 'switch', 'spikes', 'cauldron', 'nothing'],
    // number of different messages available
    messages: 3
  },

  worldGenerator: {
    generate(world) {
      // Find the marker created in Tiled. We know its ID is 29 from Tiled.
      let marker = world.findObjectByID(29)

      // Create 4 columns of eggs in front of the spikes.
      for (let i = 0; i < 4; i++) {

        // Generate a random number between 2 and 4 using WorldProxy.rng()
        let numberOfEggs = 2 + Math.floor(world.rng() * 3)

        let availableSpots = [0, 1, 2, 3]
        for (let j = 0; j < numberOfEggs; j++) {
          // Select a random spot for the egg
          let spotIndex = Math.floor(world.rng() * availableSpots.length)
          let spot = availableSpots[spotIndex]

          // Create the egg in the chosen spot
          world.createObject("egg", {
            x: marker.x + (i * 3),
            y: marker.y + spot,
            value: "rng(0,99)",
            showLottery: true //< Show value animation at the start of the level
          })

          // Remove the chosen spot from the available spots
          availableSpots.splice(spotIndex, 1)
        }
      }
    }
  },

  ruleset: {
    // CustomWinCondition object
    win: {
      // This method is called during the level initialization
      beforeStart(world) {
        // Find the highest value of all the eggs
        let max = 0
        for (let egg of world.eggs) {
          max = Math.max(max, egg.value)
        }

        // Create a 'maxValue' property on this CustomWinCondition object
        // for later use in check()
        this.maxValue = max
      },

      // This method is called after each step of the game loop
      // It should return true if the player has won, false otherwise
      check(world) {
        // Get the ids of the items in the cauldron
        const cauldronItems = world.cauldrons[0].items
        if (cauldronItems.length !== 1) {
          return false
        }

        // Find the egg with this specific id and check if its value the highest
        const eggInCauldron = world.findObjectByID(cauldronItems[0])
        return eggInCauldron.value === this.maxValue
      }
    },

    lose: [{
        // Returns an identifier of this CustomLossCondition.
        // It is used in messages property to define
        // the message to display when this condition is triggered.
        getReason(world) {
          return 'loss_reason_wrong_egg_in_cauldron'
        },

        // This method is called during the level initialization
        beforeStart(world) {
          // Find the highest value of all the eggs
          let max = 0
          for (let egg of world.eggs) {
            max = Math.max(max, egg.value)
          }

          // Create a 'maxValue' property on this CustomWinCondition object
          // for later use in check()
          this.maxValue = max
        },

        // This method is called after each step of the game loop
        // It should return true if the player has lost, false otherwise
        check(world) {
          // Get the ids of the items in the cauldron
          const cauldronItems = world.cauldrons[0].items
          if (cauldronItems.length === 0) {
            return false
          }

          // If at least one egg in the cauldron is not of highest value
          // return true.
          const eggsInCauldron = cauldronItems.map(eggID => world.findObjectByID(eggID))
          return eggsInCauldron.some(egg => egg.value < this.maxValue)
        }
      },
      'or',
      'one_hero_dead',
      'or',
      'default_loss'
    ]
  }
}