import seedrandom from 'seedrandom'

import levelManager from '../../../levels/levelManager'
import World from '../../../world/World'
import Compiler from '../../../world/ai/compile/Compiler'

self.addEventListener('message', function(e) {
  const level = levelManager.getLevelByID(e.data.levelID)
  const code = e.data.code
  fetch(`../${level.mapPath}`)
    .then(function(response) {
      return response.json()
    })
    .then(function(mapConfig) {
      testCode(level, mapConfig, code)
    })
})

function testCode(level, mapConfig, code) {
  const compiler = new Compiler(code, level.buildCompilerConfig())
  const aiFactory = compiler.compile()

  let t = Date.now()
  let tests = []
  for (let i = 0; i < 20; i++) {
    let world = new World(level, mapConfig, aiFactory)
    let {
      rng,
      seed
    } = buildRNG()
    while (!world.gameOver) {
      world.step(rng)
    }

    let lossReason = null
    if (world.hasLost) {
      lossReason = world.ruleset.getLossReason()
    }
    tests.push({
      steps: world.steps,
      rngSeed: seed,
      hasLost: world.hasLost,
      lossReason: lossReason,
    })
  }
  postMessage(tests)
}

function buildRNG() {
  return seedrandom(null, {
    pass: (rng, seed) => {
      return {
        rng: rng,
        seed: seed
      }
    }
  })
}