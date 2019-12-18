import level from './level306'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
if n == wall :
	a:
	if w == wall :
		listen("hey")
	else
		listen("lol")
	endif
	$a = calc($a + 1)
	write($a)
	jump a
endif
b:
if here == 0 &&
  here == egg :
	tell("hey" everyone)
endif
if here == 1 &&
  here == egg :
	tell("lol" everyone)
endif
if e == wall :
	c:
	step(w)
	if w != wall :
		jump c
	endif
	step(s)
else
	step(e)
endif
jump b
		`,
  }, {
    type: ["speed"],
    code: `
if n == wall :
	if w == wall :
		a:
		listen("hey")
		$a = calc($a + 1)
		write($a)
		jump a
	else
		e:
		listen("lol")
		$a = calc($a + 1)
		write($a)
		jump e
	endif
endif
d:
b:
if here == egg :
	if here == 0 :
		tell("hey" everyone)
	else
		tell("lol" everyone)
	endif
endif
if e != wall :
	step(e)
	jump b
endif
step(s)
c:
if here == egg :
	if here == 0 :
		tell("hey" everyone)
	else
		tell("lol" everyone)
	endif
endif
if w != wall :
	step(w)
	jump c
endif
step(s)
jump d
		`,
  }, ]
}