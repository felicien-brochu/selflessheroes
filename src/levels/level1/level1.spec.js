import level from './level1'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
    code: `
step(s)
step(s)
step(s)
		`,
  }]
}