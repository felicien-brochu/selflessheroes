import levelManager from '../../../levels/levelManager'
import Tester from '../../../world/Tester'

const sampleSize = 20

self.addEventListener('message', e => {
  const level = levelManager.getLevelByID(e.data.levelID)
  const code = e.data.code

  let tester = new Tester(level, code, sampleSize)
  let tests = tester.test()

  if (SHOW_STATS) {
    tester.printStats()
  }

  postMessage(tests)
})