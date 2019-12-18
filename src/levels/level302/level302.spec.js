import level from './level302'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
if w == floor :
	listen("ok")
endif
tell("ok" e)
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_order',
    frequency: 1,
    code: `
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_order',
    frequency: 1,
    code: `
if e == floor :
	listen("ok")
endif
tell("ok" w)
step(s)
step(s)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_moved_of_the_cross',
    frequency: 1,
    code: `
if w == floor :
	listen("ok")
endif
tell("ok" e)
step(s)
step(s)
step(s)
		`,
  }, ]
}