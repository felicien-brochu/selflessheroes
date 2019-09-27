import level from './level6'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
step(n)
fireball(n)
		`,
  }]
}