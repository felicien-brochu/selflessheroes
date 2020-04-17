import levelManager from '../../../levels/levelManager'
import Tester from '../../../world/Tester'

const sampleSize = 20

self.addEventListener('message', e => {
  const level = levelManager.getLevelByID(e.data.levelID)
  const code = e.data.code
  const masterSeed = e.data.masterSeed

  let actualSampleSize = level.deterministic ? 1 : sampleSize
  let tester = new Tester(level, code, actualSampleSize, sampleSize, masterSeed)
  let tests = tester.test()

  if (level.deterministic) {
    tests.length = sampleSize
    tests.fill(tests[0])
  }

  if (LEVEL_DEV) {
    tester.printStats()
  }

  postMessage(tests)
})