import seedrandom from 'seedrandom'

import levelManager from '../../../levels/levelManager'
import World from '../../../world/World'
import Compiler from '../../../world/ai/compile/Compiler'

const sampleSize = 20

self.addEventListener('message', function(e) {
  const level = levelManager.getLevelByID(e.data.levelID)
  const code = e.data.code
  testCode(level, code)
})

function testCode(level, code) {
  const compiler = new Compiler(code, level.buildCompilerConfig())
  const aiFactory = compiler.compile()

  let tests = []
  for (let i = 0; i < sampleSize; i++) {
    let {
      rng,
      seed
    } = buildRNG()
    let world = new World(level, aiFactory, rng)
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

  if (SHOW_STATS) {
    printStats(tests)
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

function printStats(tests) {
  let avg = tests.reduce((acc, test) => acc + test.steps, 0) / tests.length
  let max = tests.reduce((acc, test) => Math.max(acc, test.steps), 0)
  let min = tests.reduce((acc, test) => Math.min(acc, test.steps), Infinity)
  let variance = tests.reduce((acc, test) => acc + (test.steps - avg) ** 2, 0) / tests.length
  let maxAvg = 0
  let minAvg = Infinity
  let seriesStats = []

  for (let i = 0; i < sampleSize - 20 + 1; i++) {
    let seriesAvg = 0
    for (let j = i; j < i + 20; j++) {
      seriesAvg += tests[j].steps
    }
    seriesAvg /= 20
    seriesStats.push(seriesAvg)
    maxAvg = Math.max(maxAvg, seriesAvg)
    minAvg = Math.min(minAvg, seriesAvg)
  }
  seriesStats.sort((a, b) => a - b)

  console.debug("//// tests stats ////")
  console.debug("sample:", sampleSize)
  console.debug("avg:   ", avg)
  console.debug("max:   ", max, ` (${(max - avg) / Math.sqrt(variance)} σ)`)
  console.debug("min:   ", min, ` (${(avg - min) / Math.sqrt(variance)} σ)`)
  console.debug("σ:     ", Math.sqrt(variance))
  console.debug("σ²:    ", variance)
  console.debug("max 20:", maxAvg, `(over ${sampleSize - 20 + 1} samples)`)
  console.debug("10%   :", seriesStats[Math.floor((seriesStats.length - 1) * 0.9)])
  console.debug("5%    :", seriesStats[Math.floor((seriesStats.length - 1) * 0.95)])
  console.debug("1%    :", seriesStats[Math.floor((seriesStats.length - 1) * 0.99)])
  console.debug(".5%   :", seriesStats[Math.floor((seriesStats.length - 1) * 0.995)])
  console.debug(".1%   :", seriesStats[Math.floor((seriesStats.length - 1) * 0.999)])
  // console.debug("series:", seriesStats)
  // for (let point of seriesStats) {
  //   let graph = ''
  //   for (let i = 0; i < point - minAvg; i++) {
  //     graph += '|'
  //   }
  //   console.log(graph + '  ' + point)
  // }
}