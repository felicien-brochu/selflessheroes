import level from './level404'

export default {
  level: level,
  deterministic: false,
  specs: [{
    type: ["length"],
    code: `
$a = set(nw)
a:
$a = calc($a - 1)
clone e a
if $a == 0 :
	take(here)
endif
e:
take(s)
if w == cauldron :
	drop(w)
endif
drop(sw)
jump e
		`,
  }, {
    type: ["speed"],
    code: `
$a = set(w)
clone s c
$a = set(nw)
a:
$a = calc($a - 1)
clone e a
if $a == 0 :
	take(here)
	drop(sw)
endif
jump b
c:
d:
clone e d
e:
take(here)
drop($a)
jump e
b:
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_took_wrong_egg',
    frequency: 1,
    code: `
$a = set(nw)
a:
$a = calc($a - 1)
clone e a
if $a == 1 :
	take(here)
endif
		`,
  }, ]
}