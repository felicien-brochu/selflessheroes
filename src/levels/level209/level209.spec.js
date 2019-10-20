import level from './level209'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
step(n)
if here == egg :
	$b = calc($b + 1)
	$a = calc($a + here)
endif
if n != wall :
	jump a
endif
$a = calc($a / $b)
b:
take(here)
write($a)
drop(here)
step(s)
jump b
		`,
  }, {
    type: ["speed"],
    code: `
a:
c:
step(n)
if here == egg :
	$b = calc($b + 1)
	$a = calc($a + here)
	jump c
endif
if n != wall :
	jump a
endif
$a = calc($a / $b)
b:
take(s)
write($a)
drop(s)
step(s)
jump b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg',
    frequency: 0.99,
    code: `
a:
step(n)
take(here)
write(1)
drop(here)
jump a
		`,
  }, ]
}