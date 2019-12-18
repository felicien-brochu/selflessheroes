import level from './level101'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
take(e)
step(se)
drop(s)
		`,
  }]
}