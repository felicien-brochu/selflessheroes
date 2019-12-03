import level from './level307'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
e:
g:
step(n)
step(n)
if n == egg :
	take(n)
	jump k
endif
clone nw a
clone ne b
h:
if nw != egg ||
  ne != egg :
	jump h
endif
if nw > ne :
	take(nw)
endif
take(ne)
k:
step(s)
step(s)
if s == cauldron :
	drop(s)
endif
if w != floor :
	f:
	if se != floor :
		step(e)
		jump f
	endif
else
	i:
	if sw != floor :
		step(w)
		jump i
	endif
endif
drop(here)
jump j
a:
c:
if w == floor :
	step(w)
	jump c
endif
jump e
b:
d:
if e == floor :
	step(e)
	jump d
endif
jump g
j:
		`,
  }, {
    type: ["speed"],
    code: `
e:
g:
step(n)
step(n)
if n == egg :
	take(n)
	jump k
endif
clone nw a
clone ne b
h:
if nw != egg ||
  ne != egg :
	jump h
endif
if nw > ne :
	take(nw)
else
	take(ne)
endif
k:
step(s)
step(s)
if s == cauldron :
	drop(s)
else
	if w != floor :
		f:
		if se != floor :
			step(e)
			jump f
		endif
	else
		i:
		if sw != floor :
			step(w)
			jump i
		endif
	endif
	drop(here)
	jump j
endif
a:
c:
if w == floor :
	step(w)
	jump c
endif
jump e
b:
d:
if e == floor :
	step(e)
	jump d
endif
jump g
j:
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_egg_in_cauldron',
    frequency: 0.999,
    code: `
e:
g:
step(n)
step(n)
if n == egg :
	take(n)
	jump k
endif
clone nw a
clone ne b
h:
if nw != egg ||
  ne != egg :
	jump h
endif
if nw < ne :
	take(nw)
else
	take(ne)
endif
k:
step(s)
step(s)
if s == cauldron :
	drop(s)
else
	if w != floor :
		f:
		if se != floor :
			step(e)
			jump f
		endif
	else
		i:
		if sw != floor :
			step(w)
			jump i
		endif
	endif
	drop(here)
	jump j
endif
a:
c:
if w == floor :
	step(w)
	jump c
endif
jump e
b:
d:
if e == floor :
	step(e)
	jump d
endif
jump g
j:
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