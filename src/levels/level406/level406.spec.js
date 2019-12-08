import level from './level406'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length", "speed"],
    code: `
a:
$a = calc($a + e)
clone se a
if s == wall :
	clone n c
	c:
	d:
	clone nw d
	take(here)
	write($a)
	drop(here)
endif
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_sum_on_egg',
    frequency: 1,
    code: `
a:
$a = calc($a + 1)
clone se a
take(n)
b:
if s != wall &&
  e == egg :
	jump b
endif
c:
if s != wall &&
  e != egg :
	jump c
endif
if s != wall :
	$a = set(e)
endif
write($a)
drop(n)
		`,
  }, ]
}