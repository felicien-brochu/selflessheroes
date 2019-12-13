import level from './level408'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
clone w a
step(n)
f:
e:
clone ne b
step(nw)
if w == spikes :
	listen("ok")
endif
c:
if nw != floor :
	step(w)
	jump c
endif
step(nw)
if here == switch ||
  ne == hole :
	jump i
endif
jump e
b:
d:
if ne != floor :
	step(e)
	jump d
endif
step(ne)
if ne == floor &&
  ne != infected :
	jump f
endif
h:
if here != switch :
	i:
	step(n)
	jump h
endif
g:
fireball(nw)
jump g
a:
k:
step(w)
if n != spikes :
	jump k
endif
step(n)
step(n)
step(n)
l:
clone n l
if here == 1 :
	step(e)
endif
if n == wall :
	tell("ok" everyone)
endif
step(e)
		`,
  }, {
    type: ["speed"],
    code: `
clone n a
if w == spikes :
	$a = set(0)
	j:
	$a = calc($a + 1)
	if $a < 10 :
		jump j
	endif
	step(w)
	step(w)
endif
k:
if nw != spikes :
	step(w)
	step(w)
	jump k
endif
step(nw)
step(n)
step(ne)
l:
clone n l
if w == 1 :
	step(e)
endif
m:
jump m
a:
f:
e:
clone nw b
step(ne)
c:
if ne != floor :
	step(e)
	jump c
endif
step(ne)
if here == switch ||
  nw != floor :
	jump i
endif
jump e
b:
d:
if nw != floor :
	step(w)
	jump d
endif
step(nw)
if nw == floor :
	jump f
endif
h:
step(n)
i:
if here != switch :
	jump h
endif
g:
fireball(nw)
jump g
		`,
  }, {
    type: ["speed"],
    code: `
clone n a
if w == spikes :
	j:
	if $a < 6 :
		$a = calc($a + 1)
		jump j
	endif
endif
step(w)
step(w)
step(w)
step(w)
step(w)
step(w)
step(w)
step(w)
step(w)
step(w)
step(nw)
step(n)
step(ne)
l:
clone n l
if w == 1 :
	step(e)
endif
m:
jump m
a:
clone nw b
step(ne)
step(e)
step(e)
step(ne)
clone nw c
step(ne)
step(ne)
jump d
b:
step(w)
step(w)
step(nw)
clone ne f
step(nw)
step(nw)
step(n)
step(n)
step(n)
jump g
c:
step(nw)
step(n)
jump h
f:
step(ne)
step(n)
step(n)
d:
g:
h:
e:
fireball(nw)
jump e
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
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
a:
jump a
		`,
  }, ]
}