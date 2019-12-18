import level from './level206'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
if $a > 0 :
	$a = calc($a - 1)
else
	drop(here)
	take(s)
	$a = set(myitem)
endif
step(s)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
b:
if s == egg &&
  s > 0 :
	take(s)
	$a = set(myitem)
	a:
	if $a > 0 :
		step(s)
		$a = calc($a - 1)
		jump a
	endif
	drop(s)
endif
step(s)
jump b
		`,
  }, ]
}