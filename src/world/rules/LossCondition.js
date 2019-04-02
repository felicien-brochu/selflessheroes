export default class LossCondition {
  static build(key, world) {
    let condition
    switch (key) {
      case 'none':
        condition = new LossCondition()
        break
      default:
        condition = new LossCondition()
    }
    return condition
  }

  check() {
    return false
  }
}