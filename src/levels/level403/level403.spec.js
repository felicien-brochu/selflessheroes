import level from './level403'

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
a:
if sw != wall :
	clone sw a
endif
b:
if se != wall :
	clone se b
endif
if e != wall :
	clone e c
endif
c:
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