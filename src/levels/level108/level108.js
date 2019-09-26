import map from './map108.json'

/* length: 13, speed: 158.59
a:
step(s)
if s != wall :
	jump a
endif
d:
b:
if here == egg ||
  n != egg :
	step(n)
	jump b
endif
take(n)
c:
if s != wall :
	if here == egg ||
	  s != egg :
		step(s)
		jump c
	endif
endif
drop(here)
jump d
*/

/* speed: 118.7635
c:
a:
step(s)
if here != egg ||
  s == egg :
	jump a
endif
take(here)
b:
step(s)
if s != egg ||
  here == egg :
	if s == wall :
		drop(here)
		jump e
	endif
	jump b
endif
drop(here)
jump c
e:
f:
g:
if here == egg ||
  n != egg :
	step(n)
	jump g
endif
take(n)
h:
if here == egg ||
  s != egg :
	step(s)
	jump h
endif
drop(here)
jump f
*/

const winCondition = {
  beforeStart() {
    const eggOriginMarkerID = 99
    const originMarker = this.world.findConfigObjectByID(eggOriginMarkerID)
    this.eggs = []
    for (let x = originMarker.x; x < originMarker.x + 10; x++) {
      let columnEggs = this.world.eggs.filter(egg => egg.x === x).sort((a, b) => a.y - b.y).map(egg => egg.id)
      this.eggs.push(columnEggs)
    }
  },

  check() {
    const eggOriginMarkerID = 99
    const originMarker = this.world.findConfigObjectByID(eggOriginMarkerID)
    for (let i = 0; i < 10; i++) {
      let columnEggs = this.world.eggs.filter(egg => egg.x === i + originMarker.x && !egg.owner).sort((a, b) => a.y - b.y)

      if (columnEggs.length !== this.eggs[i].length) {
        return false
      }

      if (columnEggs[columnEggs.length - 1].y !== originMarker.y + 9) {
        return false
      }

      for (let j = 0; j < columnEggs.length; j++) {
        if (columnEggs[j].id !== this.eggs[i][j]) {
          return false
        }
      }

      for (let j = 0; j < columnEggs.length - 1; j++) {
        if (columnEggs[j + 1].y - columnEggs[j].y !== 1) {
          return false
        }
      }
    }
    return true
  },
}

const level = {
  mapConfig: map,
  name: {
    en: "Tidying up",
    fr: "Un peu de rangement",
  },
  objective: {
    en: "These %%icon icon-egg$%% eggs were scattered throughout the room. Pack them all at the bottom of the room to tidy up.\n\n%%icon mdi mdi-alert-octagon-outline$%%Warning: the %%icon icon-egg$%% eggs must remain on their vertical line and in the order in which you found them",
    fr: "Ces %%icon icon-egg$%% œufs ont été éparpillés dans la pièce. Range-les tous en bas.\n\n%%icon mdi mdi-alert-octagon-outline$%%Attention: les %%icon icon-egg$%% œufs doivent rester sur la même ligne verticale et dans l'ordre où tu les as trouvés",
  },

  maxStep: 1000,
  speedTarget: 131,
  lengthTarget: 13,

  compilerConfig: {
    excludePrimary: ['assign'],
    terrainTypes: ['wall', 'floor'],
    objectTypes: ['egg', 'hero', 'nothing'],
    actionFunctions: ['step_once', 'take', 'drop'],
    leftComparisonExpressions: ['direction', 'myitem'],
    rightComparisonExpressions: ['object_type', 'terrain_type']
  },

  ruleset: {
    win: [winCondition],
    lose: ['default_loss']
  },

  worldGenerator: [{
    type: 'eggs_matrix',
    config: {
      originMarkerID: 99,
      width: 10,
      height: 10,

      strategy: {
        type: 'random_columns',
        minEggs: 1,
        maxEggs: 5,
        eggConfig: {
          value: 'rng(0,9)',
        }
      }
    }
  }]
}

export default level