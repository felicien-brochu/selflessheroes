import level from './level012'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
a:
if w == hero :
	jump a
endif
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_order',
    frequency: 1,
    code: `
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_order',
    frequency: 1,
    code: `
a:
if w == hero &&
  e == hero :
	jump a
endif
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_order',
    frequency: 1,
    code: `
if w == nothing :
	jump b
endif
step(n)
step(s)
step(s)
b:
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_moved_of_the_cross',
    frequency: 1,
    code: `
a:
if w == hero :
	jump a
endif
step(s)
step(s)
b:
if e != hero :
	jump b
endif
step(s)
		`,
  }, ]
}