import level from './level2'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
step(s)
step(se)
		`,
  }]
}