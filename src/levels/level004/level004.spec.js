import level from './level004'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
if e == hero :
	step(w)
	step(w)
	step(w)
endif
step(e)
step(e)
		`,
  }]
}