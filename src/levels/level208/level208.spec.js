import level from './level208'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
b:
if $a > 0 ||
  $a < 0 :
	if $a < 0 :
		step(w)
		$a = calc($a + 1)
	else
		step(e)
		$a = calc($a - 1)
	endif
else
	write(0)
	drop(here)
	step(e)
	take(here)
	$a = set(myitem)
endif
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
a:
b:
if here == egg &&
  here != 0 :
	take(here)
	$a = set(myitem)
	if $a > 0 :
		c:
		if $a > 0 :
			step(e)
			$a = calc($a - 1)
			jump c
		endif
	else
		d:
		if $a < 0 :
			step(w)
			$a = calc($a + 1)
			jump d
		endif
	endif
	write(0)
	drop(here)
endif
step(e)
if e != wall :
	jump b
endif
e:
if here == egg &&
  here > 0 ||
  here == egg &&
  here < 0 :
	take(here)
	$a = set(myitem)
	if $a > 0 :
		f:
		if $a > 0 :
			step(e)
			$a = calc($a - 1)
			jump f
		endif
	else
		g:
		if $a < 0 :
			step(w)
			$a = calc($a + 1)
			jump g
		endif
	endif
	write(0)
	drop(here)
endif
step(w)
if w != wall :
	jump e
endif
jump a
		`,
  }, ]
}