import Tester from '../src/world/Tester'
import Level from '../src/levels/Level'
import chalk from 'chalk'

export default class LevelSpecTester {
  constructor(spec, config = {}) {
    this.spec = spec

    this.config = Object.assign({
      stopOnFail: false,
      speedSampleSize: 2000,
      lengthSampleSize: 2000,
      lossReasonSampleSize: 20,
      speedConfidence: 0.999,
      speedTestLostTolerance: 0.002,
      lengthTestLostTolerance: 0.002,
    }, config)

    this.level = new Level(0, this.spec.level)
    this.testMap = {
      speed: this.testSpeed.bind(this),
      speedSearch: this.testSpeedSearch.bind(this),
      length: this.testLength.bind(this),
      lossReason: this.testLossReason.bind(this),
    }
  }

  test() {
    this.failCount = 0
    this.passCount = 0

    console.log()
    console.log(chalk.bgBlack.whiteBright(`===> ${this.spec.file} (${this.level.name.en}) `))

    const deterministic = !!this.spec.deterministic

    for (let spec of this.spec.specs) {
      let types = typeof spec.type === 'string' ? [spec.type] : spec.type

      let sampleSize = types.reduce((acc, type) => Math.max(acc, this.getSpecTypeSampleSize(type)), 1)

      if (deterministic) {
        sampleSize = 1
      }

      if (spec.sampleSize !== undefined) {
        sampleSize = spec.sampleSize
      }

      let tester = new Tester(this.level, spec.code, sampleSize)

      let tests = tester.test()
      let stats = tester.getStats()

      for (let specType of types) {
        let testFunction = this.testMap[specType]
        if (typeof testFunction !== 'function') {
          this.fail(`${specType} TEST`, `'${specType}' test type is unknown`)
        } else {
          testFunction(spec, stats, tests, tester)
        }
      }
    }

    return {
      fail: this.failCount,
      pass: this.passCount,
    }
  }

  getSpecTypeSampleSize(type) {
    let sampleSize

    switch (type) {
      case 'speed':
      case 'speedSearch':
        sampleSize = this.config.speedSampleSize
        break
      case 'length':
        sampleSize = this.config.lengthSampleSize
        break
      case 'lossReason':
        sampleSize = this.config.lossReasonSampleSize
        break
      default:
        sampleSize = 1
    }
    return sampleSize
  }

  fail(testLabel, reason) {
    this.failCount++
    console.log(`${chalk.red.bold('[FAIL]')} ${testLabel}`)
    console.log(`    => ${reason}`)
    if (this.config.stopOnFail) {
      process.exit(1)
    }
  }

  pass(testLabel) {
    this.passCount++
    console.log(`${chalk.green.bold('[OK]')} ${testLabel}`)
  }

  testSpeed(spec, stats, tests, tester) {
    const label = "SPEED TEST"
    let speedThreshold = stats.seriesAverage[Math.floor((stats.seriesAverage.length - 1) * this.config.speedConfidence)]
    let lostRatio = stats.lost / tester.sampleSize

    if (Math.round(speedThreshold) > this.level.speedTarget) {
      this.fail(label, `speed threshold too big: ${speedThreshold} > ${this.level.speedTarget}`)
    } else if (lostRatio > this.config.speedTestLostTolerance) {
      this.fail(label, `lost ratio too big: ${lostRatio} > ${this.config.speedTestLostTolerance}`)
    } else {
      this.pass(`${label} ${chalk.gray(`(speed: ${speedThreshold} <= ${this.level.speedTarget}, lostRatio: ${lostRatio} <= ${this.config.speedTestLostTolerance})`)}`)
    }
  }

  testSpeedSearch(spec, stats, tests, tester) {
    const label = "SPEED SEARCH TEST"
    this.pass(label)
    tester.printStats()
  }

  testLength(spec, stats, tests, tester) {
    const label = "LENGTH TEST"
    let lostRatio = stats.lost / tester.sampleSize
    let codeLength = tester.compiler.computeCodeLength()

    if (codeLength > this.level.lengthTarget) {
      this.fail(label, `too much lines: ${codeLength} > ${this.level.lengthTarget}`)
    } else if (lostRatio > this.config.lengthTestLostTolerance) {
      this.fail(label, `lost ratio too big: ${lostRatio} > ${this.config.lengthTestLostTolerance}`)
    } else {
      this.pass(`${label} ${chalk.gray(`(lines: ${codeLength} <= ${this.level.lengthTarget}, lostRatio: ${lostRatio} <= ${this.config.lengthTestLostTolerance})`)}`)
    }
  }

  testLossReason(spec, stats, tests, tester) {
    let expectedLossReason = spec.lossReason
    const label = `LOSS REASON TEST ${expectedLossReason}`
    if (!expectedLossReason) {
      this.fail(label, 'no loss reason specified in spec')
      return
    }

    let frequency = 1
    if (spec.frequency !== undefined && spec.frequency >= 0 && spec.frequency <= 1) {
      frequency = spec.frequency
    }

    let noOther = true
    if (spec.noOther !== undefined) {
      noOther = spec.noOther
    }

    let otherLossReasons = tests.reduce((acc, test) => {
      if (test.hasLost && test.lossReason !== expectedLossReason && !acc.includes(test.lossReason)) {
        acc.push(test.lossReason)
      }
      return acc
    }, [])

    let expectedLossReasonFrequency = tests.reduce((acc, test) => test.hasLost && test.lossReason === expectedLossReason ? acc + 1 : acc, 0) / tester.sampleSize

    if (noOther && otherLossReasons.length > 0) {
      this.fail(label, `other loss reason detected: ${otherLossReasons}`)
    } else if (expectedLossReasonFrequency < frequency) {
      this.fail(label, `expected loss reason ${expectedLossReason} not that frequent: ${expectedLossReasonFrequency} < ${frequency}`)
    } else {
      this.pass(label)
    }
  }
}