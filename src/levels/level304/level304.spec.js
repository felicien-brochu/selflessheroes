import level from './level304'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
if w == wall :
	listen("ok")
	a:
	step(e)
	jump a
endif
b:
if here != switch :
	step(n)
	jump b
endif
tell("ok" everyone)
		`,
  }, {
    type: ["speed"],
    code: `
if w == wall :
	listen("ok")
	a:
	step(e)
	step(e)
	jump a
endif
b:
if n != switch :
	step(n)
	step(n)
	jump b
endif
tell("ok" everyone)
step(n)
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