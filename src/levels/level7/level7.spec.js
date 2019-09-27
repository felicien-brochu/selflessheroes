import level from './level7'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
step(sw)
fireball(s)
step(ne)
if n == bonfire :
	fireball(n)
endif
		`,
  }, {
    type: ["speed"],
    code: `
if w != wall :
	step(sw)
	fireball(s)
else
	step(ne)
	if n == bonfire :
		fireball(n)
	endif
endif
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_hero_dead',
    frequency: 1,
    code: `
step(sw)
fireball(s)
step(ne)
fireball(n)
		`,
  }, ]
}