import level from './level409'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
c:
step(e)
step(ne)
$b = set($a)
$a = set(0)
b:
step(n)
if n != wall :
	jump b
endif
a:
$a = calc($a + e)
if se != wall :
	$a = calc($a * 2)
	step(s)
	jump a
endif
step(s)
if se != wall :
	step(se)
	clone e c
endif
step(nw)
d:
$a = calc($b % 2)
take(ne)
if $a == 1 :
	write(1)
else
	write(0)
endif
drop(ne)
$b = calc($b / 2)
step(n)
jump d
		`,
  }, {
    type: ["speed"],
    code: `
c:
step(e)
step(ne)
$b = set($a)
if se == wall :
	jump e
endif
$a = set(0)
b:
step(n)
if n != wall :
	jump b
endif
a:
$a = calc($a + e)
if se != wall :
	$a = calc($a * 2)
	step(s)
	jump a
endif
step(s)
if se != wall :
	step(se)
	clone e c
endif
step(nw)
e:
d:
$a = calc($b % 2)
take(ne)
if $a == 1 :
	write(1)
else
	write(0)
endif
drop(ne)
$b = calc($b / 2)
step(n)
jump d
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_dead',
    frequency: 1,
    code: `
a:
step(e)
jump a
		`,
  }, ]
}