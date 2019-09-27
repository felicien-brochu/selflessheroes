import level from './level5'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["speed", "length"],
    code: `
if n == switch :
	step(n)
endif
if e == switch :
	step(e)
endif
if s == switch :
	step(s)
endif
step(w)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
if n == switch :
	step(n)
endif
if e == switch :
	step(e)
endif
if s == switch :
	step(w)
endif
		`,
  }, ]
}