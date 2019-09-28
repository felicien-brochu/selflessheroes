import level from './level006'

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