import level from './level203'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
b:
if w != hero :
	$a = set(sw)
	take(s)
	write($a)
	drop(s)
	step(s)
endif
jump b
		`,
  }, {
    type: ["speed"],
    code: `
a:
if w == hero :
	jump a
endif
b:
$a = set(sw)
step(s)
take(here)
write($a)
drop(here)
jump b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg',
    frequency: 0.99,
    code: `
a:
if w == hero :
	jump a
endif
b:
$a = set(w)
take(s)
write($a)
drop(s)
step(s)
jump b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_target_egg_displaced',
    frequency: 1,
    code: `
take(sw)
		`,
  }, ]
}