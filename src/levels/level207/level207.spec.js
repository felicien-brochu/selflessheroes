import level from './level207'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
b:
if $a > 0 :
	$a = calc($a - 1)
else
	write(0)
	drop(here)
	take(e)
	$a = set(myitem)
endif
step(e)
if e == wall :
	a:
	step(w)
	if w != wall :
		jump a
	endif
endif
jump b
		`,
  }, {
    type: ["speed"],
    code: `
e:
a:
if w > 0 :
	take(w)
	$a = calc(myitem - 1)
	d:
	if $a > 0 :
		step(e)
		$a = calc($a - 1)
		jump d
	endif
	write(0)
	drop(here)
else
	step(e)
endif
if e != wall :
	jump a
endif
b:
if w > 0 :
	take(w)
	$a = calc(myitem - 1)
	c:
	if $a > 0 :
		step(e)
		$a = calc($a - 1)
		jump c
	endif
	write(0)
	drop(here)
else
	step(w)
endif
if w != wall :
	jump b
endif
jump e
		`,
  }, ]
}