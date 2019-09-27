import level from './level102'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
step(s)
take(here)
drop(s)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
a:
step(s)
if s != egg :
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
    lossReason: 'loss_reason_multiple_eggs_in_cauldron',
    frequency: 1,
    code: `
a:
step(s)
if s != egg :
	jump a
endif
take(s)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
if sw != cauldron :
	drop(se)
else
	drop(s)
endif
		`,
  }, ]
}