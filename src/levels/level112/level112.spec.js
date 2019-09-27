import level from './level112'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
g:
take(n)
e:
step(s)
if s != cauldron :
	jump e
endif
b:
if here < myitem :
	step(e)
	jump b
endif
f:
if here > myitem :
	step(w)
	jump f
endif
drop(s)
c:
step(n)
d:
if n != egg &&
  e != hole :
	step(e)
	jump d
endif
if n != egg :
	step(n)
	a:
	if n != egg &&
	  w != hole :
		step(w)
		jump a
	endif
endif
if n != egg :
	jump c
endif
jump g
		`,
  }, {
    type: ["speed"],
    code: `
g:
take(n)
e:
step(s)
step(s)
if s != cauldron :
	jump e
endif
b:
if here < myitem :
	step(e)
	jump b
endif
f:
if here > myitem :
	step(w)
	jump f
endif
drop(s)
c:
step(n)
d:
if n != egg &&
  e != hole :
	step(e)
	jump d
endif
if n != egg :
	step(n)
	a:
	if n != egg &&
	  w != hole :
		step(w)
		jump a
	endif
endif
if n != egg :
	jump c
endif
jump g
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_all_hero_dead',
    code: `
step(w)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_egg_in_cauldron',
    frequency: 0.99,
    code: `
a:
take(n)
step(s)
drop(s)
step(ne)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_took_label_egg',
    code: `
take(s)
drop(e)
		`,
  }]
}