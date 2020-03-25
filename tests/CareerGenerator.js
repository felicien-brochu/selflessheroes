import levelManager from '../src/levels/levelManager'
import deepEqual from 'deep-equal'

function addIdToSpec(spec) {
  let levelID = levelManager.levels.find(level => deepEqual(level.mapConfig, spec.level.mapConfig)).id
  if (!levelID) {
    throw new Error("No corresponding mapConfig found with deep-equal")
  }
  spec.id = levelID
}

export default function CareerGenerator(specs, gameVersion) {

  specs.forEach(spec => addIdToSpec(spec))

  const careerLevels = []

  for (let spec of specs) {
    let solutions = []
    let solutionID = 0

    for (let solutionSpec of spec.specs) {
      let name = !!solutionSpec.lossReason ? solutionSpec.lossReason : solutionSpec.type.reduce((acc, type) => {
        if (acc !== "") {
          return acc + '_' + type
        }
        return type
      }, "")

      let score = {
        won: true,
        minStep: spec.level.speedTarget + 1,
        minLength: spec.level.lengthTarget + 1,
        lastStep: spec.level.speedTarget + 1,
        lastLength: spec.level.lengthTarget + 1
      }

      if (solutionSpec.type.includes('lossReason')) {
        score.won = false
        score.minStep = -1
        score.minLength = -1
        score.lastStep = -1
        score.lastLength = -1
      } else {
        if (solutionSpec.type.includes('length')) {
          score.minLength = spec.level.lengthTarget
          score.lastLength = spec.level.lengthTarget
        }
        if (solutionSpec.type.includes('speed')) {
          score.minStep = spec.level.speedTarget
          score.lastStep = spec.level.speedTarget
        }
      }

      let solution = {
        id: solutionID,
        name: name,
        editorType: 'graph',
        codeHistory: {
          revisions: [solutionSpec.code],
          activeRevision: 0,
        },
        score: score,
        hasOpen: true
      }
      solutions.push(solution)

      solutionID++
    }

    let careerLevel = {
      id: spec.id,
      solutions: solutions,
      solutionID: 0,
      score: {
        won: true,
        minStep: spec.level.speedTarget,
        minLength: spec.level.lengthTarget
      }
    }
    careerLevels.push(careerLevel)
  }

  let careerSave = {
    version: gameVersion,
    career: {
      id: 0,
      name: "complete_tests",
      levels: careerLevels
    }
  }
  return careerSave
}