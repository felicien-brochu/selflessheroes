import level from './level105'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
b:
step(s)
if s != cauldron :
	jump b
endif
drop(s)
c:
if n >= 4 ||
  n != egg :
	step(n)
	jump c
endif
take(n)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
step(s)
a:
step(s)
d:
if here >= 4 :
	jump a
endif
take(here)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
drop(s)
c:
step(n)
if n == egg :
	jump c
endif
jump d
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_egg_ge_4',
    frequency: 1,
    code: `
step(s)
a:
step(s)
d:
if here < 4 :
	jump a
endif
take(here)
b:
step(s)
step(s)
if s != cauldron :
	jump b
endif
drop(s)
c:
step(n)
if n == egg :
	jump c
endif
jump d
		`,
  }, ]
}