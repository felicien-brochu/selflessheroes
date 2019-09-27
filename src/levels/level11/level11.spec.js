import level from './level11'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
a:
if here != switch :
	step(e)
	jump a
endif
step(n)
step(n)
b:
if ne == floor :
	step(ne)
endif
step(e)
jump b
		`,
  }, {
    type: ["speed"],
    code: `
a:
if e != switch :
	step(e)
	step(e)
	jump a
endif
step(e)
step(n)
step(n)
b:
if ne == floor :
	step(ne)
endif
step(e)
step(e)
jump b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_dead',
    frequency: 1,
    code: `
step(w)
step(w)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
c:
step(e)
jump c
		`,
  }, ]
}