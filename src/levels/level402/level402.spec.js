import level from './level402'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
clone ne b
step(e)
jump a
b:
c:
step(ne)
clone nw c
step(e)
		`,
  }, {
    type: ["speed"],
    code: `
a:
step(e)
clone ne b
step(e)
step(e)
step(e)
step(n)
step(e)
jump a
b:
c:
step(ne)
clone nw c
step(e)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_too_mush_heroes',
    frequency: 1,
    code: `
b:
a:
clone n a
clone e b
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
c:
step(e)
jump c
		`,
  }, ]
}