import level from './level201'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
a:
take(s)
if myitem < 5 :
	write(0)
else
	write(9)
endif
drop(s)
step(s)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg_not_0',
    frequency: 0.99,
    code: `
a:
take(s)
if myitem < 5 :
	write(9)
endif
drop(s)
step(s)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg_not_9',
    frequency: 0.99,
    code: `
a:
take(s)
if myitem >= 5 :
	write(0)
endif
drop(s)
step(s)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_egg_displaced',
    frequency: 1,
    code: `
take(s)
drop(w)
		`,
  }, ]
}