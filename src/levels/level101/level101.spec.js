import level from './level101'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
take(e)
step(se)
drop(s)
		`,
  }]
}