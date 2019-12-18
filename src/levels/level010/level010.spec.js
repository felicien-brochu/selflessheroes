import level from './level010'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
if ne != bonfire :
	if se == floor :
		step(se)
	endif
	if ne == floor :
		step(ne)
	endif
	step(e)
	jump a
endif
fireball(ne)
		`,
  }, {
    type: ["speed"],
    code: `
a:
step(e)
if ne != bonfire :
	if e == hole :
		if ne == floor :
			step(ne)
		else
			step(se)
		endif
	endif
	jump a
endif
fireball(ne)
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