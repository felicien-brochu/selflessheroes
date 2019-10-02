import level from './level115'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
c:
a:
if w > here &&
  w == hero :
	take(w)
	drop(here)
endif
if e < here &&
  e == hero :
	take(e)
	drop(here)
endif
if ne == hole &&
  e == hero ||
  e != wall &&
  w == hero :
	step(e)
	jump a
endif
b:
if nw == hole &&
  w == hero ||
  w != wall &&
  e == hero :
	step(w)
	jump b
endif
jump c
		`,
  }, {
    type: ["speed"],
    code: `
a:
b:
if w == hero :
	if w > here :
		take(w)
		drop(here)
	endif
else
	if here > e :
		take(e)
		drop(here)
	endif
endif
if w == hero &&
  e != wall ||
  e == hero &&
  ne == hole :
	step(e)
	jump b
endif
c:
if w == hero :
	if w > here :
		take(w)
		drop(here)
	endif
else
	if here > e :
		take(e)
		drop(here)
	endif
endif
if w == hero &&
  nw == hole ||
  e == hero &&
  w != wall :
	step(w)
	jump c
endif
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_egg_in_hole',
    frequency: 1,
    code: `
a:
take(here)
drop(n)
step(w)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
if e == hero :
	step(n)
endif
		`,
  }, ]
}