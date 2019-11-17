import level from './level301'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
a:
if s != wall &&
  w == wall :
	clone sw a
endif
b:
if e != wall :
	clone e b
endif
		`,
  }, {
    type: ["speed"],
    code: `
c:
b:
a:
if s != wall :
	if w == wall :
		clone sw b
	endif
	if e == wall :
		clone se c
	endif
	clone s a
endif
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
a:
clone e a
		`,
  }, ]
}