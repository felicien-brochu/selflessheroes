import level from './level003'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
if e == switch :
	step(e)
endif
step(w)
		`,
  }]
}