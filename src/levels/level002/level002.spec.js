import level from './level002'

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