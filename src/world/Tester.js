import seedrandom from 'seedrandom'

import World from './World'
import Compiler from './ai/compile/Compiler'

export default class Tester {

  constructor(level, code, sampleSize, targetSampleSize = 20) {
    this.level = level
    this.code = code
    this.sampleSize = sampleSize
    this.targetSampleSize = targetSampleSize

    this.compiler = new Compiler(code, level.buildCompilerConfig())
    this.aiFactory = this.compiler.compile()
    this.tests = []
  }

  test() {
    this.tests = []

    for (let i = 0; i < this.sampleSize; i++) {
      let {
        rng,
        seed
      } = Tester.buildRNG()
      let world = new World(this.level, this.aiFactory, rng)
      while (!world.gameOver) {
        world.step()
      }

      this.tests.push({
        steps: world.steps,
        rngSeed: seed,
        hasLost: world.hasLost,
        lossReason: world.lossReason,
      })
    }

    return this.tests
  }

  static buildRNG() {
    return seedrandom(null, {
      pass: (rng, seed) => {
        return {
          rng: rng,
          seed: seed
        }
      }
    })
  }

  getStats(seriesSampleSize = this.sampleSize) {
    let avg = this.tests.reduce((acc, test) => acc + test.steps, 0) / this.tests.length
    let max = this.tests.reduce((acc, test) => Math.max(acc, test.steps), 0)
    let min = this.tests.reduce((acc, test) => Math.min(acc, test.steps), Infinity)
    let lost = this.tests.reduce((acc, test) => test.hasLost ? acc + 1 : acc, 0)
    let variance = this.tests.reduce((acc, test) => acc + (test.steps - avg) ** 2, 0) / this.tests.length
    let maxAvg = 0
    let minAvg = Infinity
    let seriesAverage = []
    let lostSeries = 0

    for (let i = 0; i < seriesSampleSize; i++) {
      let seriesAvg = 0
      let seriesLost = false
      for (let j = 0; j < this.targetSampleSize; j++) {
        let test = this.tests[Math.floor(Math.random() * this.sampleSize)]
        seriesAvg += test.steps

        if (!seriesLost && test.hasLost) {
          lostSeries++
          seriesLost = true
        }
      }
      seriesAvg /= this.targetSampleSize
      seriesAverage.push(seriesAvg)
      maxAvg = Math.max(maxAvg, seriesAvg)
      minAvg = Math.min(minAvg, seriesAvg)
    }
    seriesAverage.sort((a, b) => a - b)

    return {
      avg,
      max,
      min,
      lost,
      variance,
      maxAvg,
      minAvg,
      seriesAverage,
      lostSeries,
    }
  }

  printStats() {
    let {
      avg,
      max,
      min,
      lost,
      variance,
      maxAvg,
      minAvg,
      seriesAverage,
      lostSeries,
    } = this.getStats()

    console.debug("//// tests stats ////")
    console.debug("sample:", this.sampleSize)
    console.debug("avg:   ", avg)
    console.debug("max:   ", max, ` (${(max - avg) / Math.sqrt(variance)} σ)`)
    console.debug("min:   ", min, ` (${(avg - min) / Math.sqrt(variance)} σ)`)
    console.debug("lost:  ", `${(lost / this.sampleSize) * 100}%`)
    console.debug("σ:     ", Math.sqrt(variance))
    console.debug("σ²:    ", variance)
    console.debug("minSer:", minAvg, `(over ${seriesAverage.length} samples)`)
    console.debug("maxSer:", maxAvg, `(over ${seriesAverage.length} samples)`)
    console.debug("lostSr:", `${(lostSeries / (seriesAverage.length)) * 100}%`)
    console.debug("10%   :", seriesAverage[Math.floor((seriesAverage.length - 1) * 0.9)])
    console.debug("5%    :", seriesAverage[Math.floor((seriesAverage.length - 1) * 0.95)])
    console.debug("1%    :", seriesAverage[Math.floor((seriesAverage.length - 1) * 0.99)])
    console.debug(".5%   :", seriesAverage[Math.floor((seriesAverage.length - 1) * 0.995)])
    console.debug(".1%   :", seriesAverage[Math.floor((seriesAverage.length - 1) * 0.999)])
    // console.debug("series:", seriesAverage)
    // for (let point of seriesAverage) {
    //   let graph = ''
    //   for (let i = 0; i < point - minAvg; i++) {
    //     graph += '|'
    //   }
    //   console.log(graph + '  ' + point)
    // }
  }
}