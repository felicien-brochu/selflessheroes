import level from './level408'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
if n == spikes :
	clone e b
	listen("wait")
	m:
	if $a < 3 :
		$a = calc($a + 1)
		jump m
	endif
	step(n)
	step(n)
	step(ne)
	n:
	step(n)
	clone s p
	if n != wall :
		jump n
	endif
	p:
	if w == 1 :
		step(e)
	endif
	if n == wall :
		tell("ok" everyone)
	endif
	q:
	jump q
endif
listen("ok")
o:
step(s)
jump o
b:
d:
e:
a:
step(e)
if e == floor :
	jump a
endif
c:
if e == hole :
	step(n)
	if here == switch :
		jump k
	endif
	jump c
endif
clone w i
jump e
i:
f:
h:
if w == floor :
	step(w)
	jump h
endif
g:
if w == hole :
	step(n)
	if here == switch :
		tell("wait" everyone)
		jump j
	endif
	jump g
endif
clone e d
jump f
j:
k:
l:
fireball(ne)
fireball(ne)
jump l
		`,
  }, {
    type: ["speedSearch"],
    code: `
if n == spikes :
	clone e b
	listen("wait")
	m:
	if $a < 3 :
		$a = calc($a + 1)
		jump m
	endif
	step(n)
	step(n)
	step(ne)
	n:
	step(n)
	clone s p
	if n != wall :
		jump n
	endif
	p:
	if w == 1 :
		step(e)
	endif
	if n == wall :
		tell("ok" everyone)
	endif
	q:
	jump q
endif
listen("ok")
o:
step(s)
jump o
b:
d:
e:
a:
step(e)
if e == floor :
	jump a
endif
c:
if e == hole :
	step(n)
	if here == switch :
		jump k
	endif
	jump c
endif
clone w i
jump e
i:
f:
h:
if w == floor :
	step(w)
	jump h
endif
g:
if w == hole :
	step(n)
	if here == switch :
		tell("wait" everyone)
		jump j
	endif
	jump g
endif
clone e d
jump f
j:
k:
l:
fireball(ne)
fireball(ne)
jump l
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_too_mush_heroes',
    frequency: 1,
    code: `
c:
b:
a:
clone n a
clone w b
clone e c
		`,
  }, ]
}