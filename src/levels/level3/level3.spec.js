import level from './level3'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
    code: `
if e == switch :
	step(e)
endif
step(w)
		`,
  }]
}