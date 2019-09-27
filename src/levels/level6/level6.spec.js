import level from './level6'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
    code: `
step(n)
fireball(n)
		`,
  }]
}