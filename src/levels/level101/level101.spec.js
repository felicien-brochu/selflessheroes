import level from './level101'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
    code: `
take(e)
step(se)
drop(s)
		`,
  }]
}