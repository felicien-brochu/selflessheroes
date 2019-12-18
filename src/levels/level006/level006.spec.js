import level from './level006'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
step(n)
fireball(n)
		`,
  }]
}