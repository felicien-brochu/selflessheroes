import level from './level110'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
a:
if n >= s &&
  n >= w :
	take(n)
endif
if s >= w &&
  s >= n :
	take(s)
endif
take(w)
drop(e)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_one_egg_not_max',
    frequency: 1,
    code: `
a:
if n <= s &&
  n <= w :
	take(n)
endif
if s <= w &&
  s <= n :
	take(s)
endif
take(w)
drop(e)
jump a
		`,
  }]
}