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
    type: ["lossReason"],
    lossReason: 'loss_reason_moved_of_the_cross',
    frequency: 1,
    code: `
step(s)
step(s)
		`,
  }, ]
}