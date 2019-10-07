import level from './level202'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
$a = set(w)
c:
step(e)
if e == nothing :
	jump c
endif
take(e)
write($a)
drop(e)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg',
    frequency: 0.99,
    code: `
c:
step(e)
if e == nothing :
	jump c
endif
take(e)
write(1)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_target_egg_displaced',
    frequency: 1,
    code: `
take(w)
		`,
  }, ]
}