import level from './level405'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
$a = set(n)
$b = set(w)
b:
a:
if $a == 1 :
	if $b == 1 :
		take(here)
		$a = nearest(cauldron)
		drop($a)
	endif
	$b = calc($b - 1)
	clone s a
endif
$a = calc($a - 1)
clone e b
		`,
  }, {
    type: ["speed"],
    code: `
$a = set(n)
$b = set(w)
e:
d:
c:
if $a > 1 &&
  $b > 1 :
	$a = calc($a - 1)
	$b = calc($b - 1)
	clone se c
else
	if $a == 1 :
		if $b > 1 :
			$b = calc($b - 1)
			clone s d
		else
			take(here)
			$a = nearest(cauldron)
			drop($a)
		endif
	else
		$a = calc($a - 1)
		clone e e
	endif
endif
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_took_wrong_egg',
    frequency: 1,
    code: `
$a = set(n)
$b = set(w)
b:
a:
if $a == 1 :
	if $b == 3 :
		take(here)
		$a = nearest(cauldron)
		drop($a)
	endif
	$b = calc($b - 1)
	clone s a
endif
$a = calc($a - 1)
clone e b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_too_mush_heroes',
    frequency: 1,
    code: `
$a = set(n)
$b = set(w)
c:
b:
a:
$a = calc($a - 1)
$b = calc($b - 1)
clone se a
if $a == 0 &&
  $b == 0 :
	take(here)
	$a = nearest(cauldron)
	drop($a)
endif
$a = calc($a + 1)
clone s b
$b = calc($b + 1)
$a = calc($a - 1)
clone e c
		`,
  }, ]
}