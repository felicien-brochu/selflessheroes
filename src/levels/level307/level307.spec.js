import level from './level307'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length", "speed"],
    code: `
if w == switch :
	b:
	if n == wall :
		listen("hey")
	else
		listen("ho")
	endif
	step(w)
	listen("stop")
	step(e)
	jump b
endif
a:
if here == 1 :
	tell("hey" everyone)
endif
if s == 1 :
	tell("ho" everyone)
endif
step(e)
step(e)
tell("stop" everyone)
step(n)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 0.9,
    code: `
a:
step(e)
jump a
		`,
  }, ]
}