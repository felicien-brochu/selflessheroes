import level from './level008'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
fireball(s)
fireball(n)
step(e)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
if s == bonfire :
	a:
	fireball(s)
	step(e)
	jump a
else
	b:
	fireball(n)
	step(e)
	jump b
endif
		`,
  }, ]
}