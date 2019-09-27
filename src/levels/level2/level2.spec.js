import level from './level2'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
    code: `
step(s)
step(se)
		`,
  }]
}