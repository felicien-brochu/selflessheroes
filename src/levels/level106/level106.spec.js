import level from './level106'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
take(w)
drop(e)
if nw < sw :
	take(sw)
endif
take(nw)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
a:
take(w)
drop(e)
if sw > nw :
	take(sw)
else
	take(nw)
endif
drop(e)
take(w)
drop(e)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_not_maximum_egg_in_cauldron',
    frequency: 0.90,
    code: `
a:
take(w)
drop(e)
if sw < nw :
	take(sw)
else
	take(nw)
endif
drop(e)
take(w)
drop(e)
jump a
		`,
  }, ]
}