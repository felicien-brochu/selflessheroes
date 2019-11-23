import level from './level104'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
step(s)
if here < 4 :
	take(here)
endif
drop(s)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
a:
step(s)
if s >= 4 :
	jump a
endif
take(s)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_egg_ge_4',
    frequency: 1,
    code: `
a:
step(s)
if s < 4 :
	jump a
endif
take(s)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
drop(s)
		`,
  }, ]
}