import level from './level210'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
if e == wall :
	$b = set(1)
	c:
	if nw != hero :
		jump c
	endif
endif
a:
if $b == 0 :
	step(n)
else
	step(w)
endif
$a = calc($a + here)
if n == egg ||
  $b == 1 &&
  w == egg :
	jump a
endif
$a = calc($a / 10)
b:
take(here)
write($a)
drop(here)
if $b == 0 :
	step(n)
	d:
	if $b == 0 ||
	  $b == 2 &&
	  se != hero :
		if s == hero :
			$b = set(2)
		endif
		jump d
	endif
	$a = set(s)
endif
if $b != 1 :
	step(s)
else
	step(e)
endif
jump b
		`,
  }, {
    type: ["speed"],
    code: `
if e == wall :
	c:
	if w != hero :
		jump c
	endif
	h:
	if sw != hero :
		jump h
	endif
	f:
	$a = calc($a + w)
	step(w)
	if w == egg :
		jump f
	endif
	$a = calc($a / 10)
	g:
	take(here)
	write($a)
	drop(here)
	step(e)
	jump g
endif
a:
step(n)
$a = calc($a + here)
if n == egg :
	jump a
endif
$a = calc($a / 10)
take(here)
write($a)
step(s)
drop(n)
d:
if n != hero :
	jump d
endif
e:
if ne != hero :
	jump e
endif
$a = set(n)
b:
take(here)
write($a)
drop(here)
step(s)
jump b
		`,
  }, ]
}