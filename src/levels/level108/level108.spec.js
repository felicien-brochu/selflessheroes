import level from './level108'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
c:
b:
step(s)
if s != wall :
	jump b
endif
a:
drop(here)
if n != egg ||
  here != nothing :
	step(n)
	jump a
endif
take(n)
jump c
		`,
  }, {
    type: ["speed"],
    code: `
c:
a:
step(s)
if here != egg ||
  s == egg :
	jump a
endif
take(here)
b:
step(s)
if s != egg ||
  here == egg :
	if s == wall :
		drop(here)
		jump e
	endif
	jump b
endif
drop(here)
jump c
e:
f:
g:
if here == egg ||
  n != egg :
	step(n)
	jump g
endif
take(n)
h:
if here == egg ||
  s != egg :
	step(s)
	jump h
endif
drop(here)
jump f
		`,
  }]
}