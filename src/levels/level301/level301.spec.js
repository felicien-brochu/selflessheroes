import level from './level301'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
if w == hole :
	listen("ok")
endif
a:
step(e)
if here != switch :
	jump a
endif
tell("ok" se)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
a:
if here != switch :
	step(e)
	jump a
endif
		`,
  }, ]
}