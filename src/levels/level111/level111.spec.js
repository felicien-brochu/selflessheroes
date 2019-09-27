import level from './level111'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
take(s)
step(s)
step(s)
step(s)
b:
if here != myitem :
	if here > myitem :
		step(w)
	else
		step(e)
	endif
	jump b
endif
drop(s)
		`,
  }, {
    type: ["speed"],
    code: `
take(s)
step(s)
step(s)
if s != myitem :
	if s > myitem :
		a:
		if sw != myitem :
			step(w)
			jump a
		endif
		c:
		step(sw)
		if s != cauldron :
			jump c
		endif
	else
		b:
		if se != myitem :
			step(e)
			jump b
		endif
		d:
		step(se)
		if s != cauldron :
			jump d
		endif
	endif
else
	step(s)
endif
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_egg_in_cauldron',
    frequency: 0.99,
    code: `
take(s)
step(s)
step(s)
step(s)
drop(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_took_label_egg',
    code: `
step(s)
step(s)
take(s)
drop(e)
		`,
  }]
}