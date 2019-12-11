import level from './level311'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length", "speed"],
    code: `
$a = calc(s * 2)
$b = calc(se * 2)
if $b >= 10 :
	$a = calc($a + 1)
else
	$b = set(nw)
endif
$a = calc($a % 10)
step(s)
take(here)
write($a)
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_not_same_time',
    frequency: 1,
    code: `
if e != hero :
	take(s)
endif
step(s)
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_number',
    frequency: 1,
    code: `
$a = set(s)
$a = calc($a * 3)
if se == egg :
	listen("hey")
endif
if se == hero :
	$a = calc($a + 1)
endif
if $a > 9 :
	$a = calc($a % 10)
	step(s)
	tell("hey" nw)
	take(here)
	write($a)
else
	tell("hey" w)
	take(s)
	write($a)
	step(s)
endif
if w != nothing :
	listen("ok")
else
	tell("ok" everyone)
endif
drop(s)
		`,
  }, ]
}