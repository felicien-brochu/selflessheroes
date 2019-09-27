import level from './level4'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
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