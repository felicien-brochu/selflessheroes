import level from './level013'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
a:
if w == hero &&
  e == hero :
	jump a
endif
if sw == hero ||
  se == hero ||
  se != hero &&
  sw != hero &&
  nw != hero &&
  ne != hero &&
  w == hero :
	step(n)
else
	step(s)
endif
		`,
  }, {
    type: ["speed"],
    code: `
if w != hero &&
  e == hero :
    step(ne)
endif
a:
if n == hero :
    step(sw)
else
    if nw == hero :
        step(ne)
    endif
endif
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_moved_of_the_cross',
    frequency: 1,
    code: `
step(s)
step(s)
		`,
  }, ]
}