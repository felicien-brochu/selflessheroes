import level from './level107'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
take(s)
a:
step(s)
if here > myitem :
	drop(e)
	take(here)
endif
drop(s)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
step(s)
take(here)
a:
step(s)
if here > myitem :
	drop(e)
	take(here)
endif
drop(s)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_egg_not_max',
    frequency: 0.99,
    code: `
step(s)
take(here)
a:
step(s)
if here < myitem :
	drop(e)
	take(here)
endif
drop(s)
jump a
		`,
  }, ]
}