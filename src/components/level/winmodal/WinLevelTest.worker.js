import seedrandom from 'seedrandom'

import levelManager from '../../../levels/levelManager'
import World from '../../../world/World'
import Compiler from '../../../world/ai/compile/Compiler'

const sampleSize = 20

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
  for (let i = 0; i < sampleSize; i++) {
    let {
      rng,
      seed
    } = buildRNG()
    let world = new World(level, mapConfig, aiFactory, rng)
    while (!world.gameOver) {
      world.step()
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

  let avg = tests.reduce((acc, test) => acc + test.steps, 0) / tests.length
  let variance = tests.reduce((acc, test) => acc + (test.steps - avg) ** 2, 0) / tests.length

  console.debug("//// tests stats ////")
  console.debug("sample:   ", sampleSize)
  console.debug("avg:      ", avg)
  console.debug("std dev:  ", Math.sqrt(variance))
  console.debug("variance: ", variance)

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