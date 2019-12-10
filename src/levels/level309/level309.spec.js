import level from './level309'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
if e == wall :
	h:
	f:
	step(s)
	if sw != switch :
		jump f
	endif
	g:
	if sw != npc :
		jump g
	endif
	tell("hey" everyone)
	b:
	step(n)
	if nw != switch :
		jump b
	endif
	e:
	if nw != npc :
		jump e
	endif
	tell("ho" everyone)
	jump h
endif
a:
if n != wall &&
  n == hero :
	$a = calc($a + 1)
	jump a
endif
$a = calc($a % 2)
d:
c:
step(e)
if e != spikes ||
  here == spikes :
	jump c
endif
if $a == 1 :
	listen("hey")
else
	listen("ho")
endif
step(e)
jump d
		`,
  }, {
    type: ["speed"],
    code: `
if e == wall :
	h:
	b:
	step(n)
	step(n)
	if nw != switch :
		jump b
	endif
	e:
	if nw != npc :
		jump e
	endif
	tell("ho" everyone)
	f:
	step(s)
	step(s)
	if sw != switch :
		jump f
	endif
	g:
	if sw != npc :
		jump g
	endif
	tell("hey" everyone)
	jump h
endif
a:
if s != wall &&
  s == hero &&
  n != wall &&
  n == hero :
	$a = calc($a + 1)
	jump a
endif
step(e)
$a = calc($a % 2)
d:
c:
if e != spikes ||
  here == spikes :
	step(e)
	jump c
endif
if ne == nothing &&
  ne == floor :
	step(ne)
	$a = calc($a + 1)
	$a = calc($a % 2)
endif
if $a == 1 :
	listen("hey")
else
	listen("ho")
endif
step(e)
i:
step(e)
if e != spikes &&
  e != wall ||
  here == spikes :
	jump i
endif
if e != wall :
	jump d
endif
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