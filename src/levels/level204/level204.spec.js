import level from './level204'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
if here == egg ||
  n == wall :
	if s > $a :
		$a = set(s)
	endif
	step(s)
	jump a
endif
take(s)
write($a)
drop(s)
		`,
  }, {
    type: ["speed"],
    code: `
a:
if s == egg :
	if s > $a :
		$a = set(s)
	endif
	step(s)
	jump a
endif
step(s)
take(s)
write($a)
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg',
    frequency: 0.99,
    code: `
a:
if s == egg :
	step(s)
	jump a
endif
step(s)
take(s)
write(1)
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_numbered_egg_displaced',
    frequency: 1,
    code: `
take(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_ended',
    frequency: 1,
    code: `
a:
if s == egg :
	if s > $a :
		$a = set(s)
	endif
	step(s)
	jump a
endif
step(s)
take(s)
write($a)
drop(e)
		`,
  }, ]
}