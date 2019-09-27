import level from './level109'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
if w > myitem :
	step(w)
endif
step(e)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
a:
if w > myitem :
	step(w)
else
	step(e)
endif
jump a
		`,
  }]
}