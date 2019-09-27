import level from './level113'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
b:
step(e)
if s <= se &&
  e != wall :
	jump b
endif
if e == wall :
	c:
	step(w)
	if w != wall :
		jump c
	endif
endif
take(s)
drop(here)
take(se)
drop(s)
take(here)
drop(se)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
e:
b:
a:
step(e)
if s <= se &&
  e != wall :
	jump b
endif
if e != wall :
	take(s)
	drop(here)
	take(se)
	drop(s)
	take(here)
	drop(se)
	jump a
endif
d:
c:
step(w)
if s >= sw &&
  w != wall :
	jump d
endif
if w != wall :
	take(s)
	drop(here)
	take(sw)
	drop(s)
	take(here)
	drop(sw)
	jump c
endif
jump e
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_egg_in_hole',
    frequency: 1,
    code: `
a:
take(s)
drop(n)
step(w)
jump a
		`,
  }, ]
}