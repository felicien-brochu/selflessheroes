import level from './level001'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
step(s)
step(s)
step(s)
		`,
  }]
}