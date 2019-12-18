import level from './level308'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
if w == switch ||
  nw == switch :
	b:
	if n != wall &&
	  n == hero :
		$a = calc($a + 1)
		jump b
	endif
	step(w)
	c:
	$b = set($a)
	step(e)
	if s == wall :
		tell("coffee" everyone)
	endif
	d:
	listen("lol")
	if $b > 0 :
		$b = calc($b - 1)
		jump d
	endif
	step(w)
	tell("ho" everyone)
	listen("ok")
	if s == hero :
		step(e)
	endif
	listen("wait")
	jump c
endif
listen("coffee")
e:
a:
tell("lol" everyone)
listen("ho")
if here == 1 ||
  here != egg :
	tell("ok" everyone)
endif
if s != wall :
	step(s)
	jump a
endif
step(ne)
step(ne)
tell("wait" everyone)
f:
step(n)
if n != wall :
	jump f
endif
jump e
		`,
  }, {
    type: ["speed"],
    code: `
if w == switch ||
  nw == switch :
	b:
	if n != wall &&
	  n == hero :
		$a = calc($a + 1)
		jump b
	endif
	step(w)
	$b = set($a)
	if s == wall :
		tell("coffee" everyone)
		tell("stop" everyone)
	else
		listen("stop")
	endif
	step(e)
	c:
	d:
	if $b > 0 :
		$b = calc($b - 1)
		listen("lol")
		jump d
	endif
	step(w)
	listen("ok")
	if s == hero :
		step(e)
	endif
	listen("wait")
	step(e)
	$b = set($a)
	jump c
endif
listen("coffee")
e:
a:
tell("lol" everyone)
$a = set(0)
$a = set(0)
if here == 1 ||
  here != egg :
	tell("ok" everyone)
endif
if s != wall :
	step(s)
	jump a
endif
step(ne)
step(ne)
f:
step(n)
if n != wall :
	jump f
endif
tell("wait" everyone)
jump e
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
a:
step(e)
jump a
		`,
  }, ]
}