import level from './level1'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
step(s)
step(s)
step(s)
		`,
  }]
}