import EggsMatrixGenerator from './EggsMatrixGenerator'

const generatorMap = {
  eggs_matrix: EggsMatrixGenerator,
}

export default class WorldGeneratorFactory {
  static build(type, config = {}) {
    let generatorClass = generatorMap[type]
    let generator = null
    if (generatorClass) {
      generator = new generatorClass(config)
    }
    return generator
  }
}