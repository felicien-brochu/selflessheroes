import level from './level304'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
b:
step(n)
if here != switch &&
  w == hole :
	jump b
endif
tell("ok" everyone)
listen("ok")
a:
step(e)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
b:
step(n)
if n != switch &&
  w == hole :
	jump b
endif
tell("ok" everyone)
step(n)
listen("ok")
a:
step(e)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
step(e)
		`,
  }, ]
}