import level from './level306'

export default {
  level: level,
  deterministic: false,
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
	if here == 0 :
		tell("hey" everyone)
	else
		tell("lol" everyone)
	endif
	if e != egg :
		c:
		step(w)
		if here == egg :
			jump c
		endif
		step(s)
	endif
	step(e)
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
if here == 0 :
	tell("hey" everyone)
else
	tell("lol" everyone)
endif
if e == egg :
	step(e)
	jump b
endif
step(s)
c:
if here == 0 :
	tell("hey" everyone)
else
	tell("lol" everyone)
endif
if w == egg :
	step(w)
	jump c
endif
step(s)
jump d
		`,
  }, ]
}