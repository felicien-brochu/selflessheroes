import level from './level211'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
a:
if e != egg ||
  n == hero :
	$a = calc($a + 1)
	step(s)
	jump a
endif
b:
$c = calc($c + 1)
take(e)
$d = calc($c * 4)
if $b == 0 :
	$d = calc($d + $a)
else
	$d = calc($d + 3)
	$d = calc($d - $a)
endif
write($d)
step(w)
step(w)
step(w)
drop(w)
c:
if e != egg :
	step(e)
	jump c
endif
$b = calc($b + 1)
$b = calc($b % 2)
jump b
		`,
  }, {
    type: ["speed"],
    code: `
if n != wall :
	a:
	$a = calc($a + 1)
	step(s)
	if e != egg ||
	  n == hero :
		jump a
	endif
endif
b:
$c = calc($c + 1)
take(e)
$d = calc($c * 4)
if $b == 0 :
	$d = calc($d + $a)
else
	$d = calc($d + 3)
	$d = calc($d - $a)
endif
write($d)
step(w)
step(w)
step(w)
drop(w)
step(e)
step(e)
step(e)
step(e)
$b = calc($b + 1)
$b = calc($b % 2)
jump b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_dead',
    frequency: 1,
    code: `
a:
if e != egg ||
  n == hero :
	$a = calc($a + 1)
	step(s)
	jump a
endif
b:
$c = calc($c + 1)
take(e)
$d = calc($c * 4)
if $b == 0 :
	$d = calc($d + $a)
else
	$d = calc($d + 2)
	$d = calc($d - $a)
endif
write($d)
step(w)
step(w)
step(w)
drop(w)
c:
if e != egg :
	step(e)
	jump c
endif
$b = calc($b + 1)
$b = calc($b % 2)
jump b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_dead',
    frequency: 1,
    code: `
if n != wall :
	a:
	$a = calc($a + 1)
	step(s)
	if e != egg ||
	  n == hero :
		jump a
	endif
endif
b:
$c = calc($c + 1)
take(e)
$d = calc($c * 4)
if $b == 0 :
	$d = calc($d + $a)
else
	$d = calc($d + 3)
	$d = calc($d - $a)
endif
write($d)
step(w)
step(w)
step(w)
step(e)
step(w)
step(e)
step(w)
step(e)
step(e)
step(w)
step(e)
step(w)
step(e)
step(w)
step(e)
step(w)
step(w)
drop(w)
step(e)
step(e)
step(e)
step(e)
$b = calc($b + 1)
$b = calc($b % 2)
jump b
		`,
  }, ]
}