import chalk from 'chalk'
import cliProgress from 'cli-progress'
import Tester from '../src/world/Tester'
import Level from '../src/levels/Level'

export default class LevelSpecTester {
  constructor(spec, config = {}, source = 'campaign') {
    this.spec = spec

    this.config = Object.assign({
      stopOnFail: false,
      speedSampleSize: 2000,
      lengthSampleSize: 2000,
      lossReasonSampleSize: 20,
      speedConfidence: 0.999,
      speedTestLostTolerance: 0.002,
      lengthTestLostTolerance: 0.002,
      showStats: false,
    }, config)

    this.level = new Level(0, this.spec.level, source)
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
    console.log(chalk.bgBlack.whiteBright(`===> ${this.spec.file} (${this.level.messages.en.name}) `))

    const deterministic = !!this.spec.level.deterministic

    for (let spec of this.spec.specs) {
      let types = typeof spec.type === 'string' ? [spec.type] : spec.type

      let sampleSize = types.reduce((acc, type) => Math.max(acc, this.getSpecTypeSampleSize(type)), 1)

      if (deterministic) {
        sampleSize = 1
      }

      if (spec.sampleSize !== undefined) {
        sampleSize = spec.sampleSize
      }

      this.createProgressBar(sampleSize)

      let tester = new Tester(this.level, spec.code, sampleSize, 20, null, this.updateProgressBar.bind(this))

      let tests = tester.test()
      let stats = tester.getStats()

      this.destroyProgressBar()

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
    let speedThreshold = stats.seriesAverage[Math.floor((stats.seriesAverage.length - 1) * this.config.speedConfidence)]
    let lostRatio = stats.lost / tester.sampleSize
    const label = `SPEED TEST ${chalk.gray(`(speed: ${Math.round(speedThreshold)} <= ${this.level.speedTarget}, lostRatio: ${lostRatio} <= ${this.config.speedTestLostTolerance})`)}`

    if (Math.round(speedThreshold) > this.level.speedTarget) {
      this.fail(label, `average speed slower than speedTarget: ${Math.round(speedThreshold)} > ${this.level.speedTarget}`)
    } else if (lostRatio > this.config.speedTestLostTolerance) {
      this.fail(label, `loss ratio too big: ${lostRatio} > ${this.config.speedTestLostTolerance}`)
    } else {
      this.pass(label)
    }

    if (this.config.showStats) {
      tester.printStats()
    }
  }

  testSpeedSearch(spec, stats, tests, tester) {
    const label = "SPEED SEARCH TEST"
    this.pass(label)
    tester.printStats()
  }

  testLength(spec, stats, tests, tester) {
    let lostRatio = stats.lost / tester.sampleSize
    let codeLength = tester.compiler.computeCodeLength()
    const label = `LENGTH TEST ${chalk.gray(`(lines: ${codeLength} <= ${this.level.lengthTarget}, lostRatio: ${lostRatio} <= ${this.config.lengthTestLostTolerance})`)}`

    if (codeLength > this.level.lengthTarget) {
      this.fail(label, `more lines than lengthTarget: ${codeLength} > ${this.level.lengthTarget}`)
    } else if (lostRatio > this.config.lengthTestLostTolerance) {
      this.fail(label, `loss ratio too big: ${lostRatio} > ${this.config.lengthTestLostTolerance}`)
    } else {
      this.pass(label)
    }
  }

  testLossReason(spec, stats, tests, tester) {
    let expectedLossReason = spec.lossReason
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

    const label = `LOSS REASON TEST ${expectedLossReason} ${chalk.gray(`(frequency: ${expectedLossReasonFrequency} >= ${frequency})`)}`

    if (noOther && otherLossReasons.length > 0) {
      this.fail(label, `other loss reason detected: ${otherLossReasons}`)
    } else if (expectedLossReasonFrequency < frequency) {
      this.fail(label, `expected loss reason ${expectedLossReason} not that frequent: ${expectedLossReasonFrequency} < ${frequency}`)
    } else {
      this.pass(label)
    }
  }

  createProgressBar(sampleSize) {
    this.progressBar = new cliProgress.SingleBar({
      format: '{bar} {value}/{total} tests | ETA: {eta_formatted}',
      clearOnComplete: true,
      hideCursor: true
    }, cliProgress.Presets.shades_classic)
    this.progressBar.start(sampleSize, 0)
  }

  updateProgressBar(progress) {
    this.progressBar.update(progress)
  }

  destroyProgressBar() {
    if (this.progressBar) {
      this.progressBar.stop()
      this.progressBar = null
    }
  }
}