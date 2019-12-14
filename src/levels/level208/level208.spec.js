import level from './level208'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
a:
step(e)
if e != wall :
	jump a
endif
b:
step(w)
if w == egg &&
  w > 0 &&
  $a == 0 :
	take(w)
	$b = set(myitem)
	c:
	if here == egg &&
	  here > 0 :
		$a = calc($a + 1)
	endif
	if $b > 1 :
		step(e)
		$b = calc($b - 1)
		jump c
	endif
	drop(here)
endif
if w == egg &&
  w > 0 :
	$a = calc($a - 1)
endif
jump b
		`,
  }, {
    type: ["speed"],
    code: `
a:
step(e)
if e != wall :
	jump a
endif
b:
step(w)
if w == egg &&
  w > 0 :
	if $a == 0 :
		take(w)
		$b = set(myitem)
		c:
		if here == egg &&
		  here > 0 :
			$a = calc($a + 1)
		endif
		if $b > 1 :
			step(e)
			$b = calc($b - 1)
			jump c
		endif
		drop(here)
		if w == egg &&
		  w > 0 :
			$a = calc($a - 1)
		endif
	else
		$a = calc($a - 1)
	endif
endif
jump b
		`,
  }, ]
}

// {
// 	type: ["length"],
// 	code: `
// j:
// take(here)
// $e = calc(myitem + 1)
// a:
// if $e > 1 :
// if e == egg :
// 	$c = calc($c + 1)
// endif
// step(e)
// $e = calc($e - 1)
// jump a
// endif
// drop(here)
// $g = set(0)
// b:
// if $g < $b :
// $e = calc($e * 2)
// $g = calc($g + 1)
// jump b
// endif
// $d = calc($a % $e)
// $f = calc($a / 2)
// $f = calc($f % $e)
// $d = calc($d - $f)
// $f = calc($a / 2)
// c:
// if $g < $c :
// $e = calc($e * 2)
// $g = calc($g + 1)
// jump c
// endif
// $f = calc($f % $e)
// $d = calc($d + $f)
// $d = calc($d + $e)
// $d = calc($d + $a)
// $e = calc($e * 2)
// $f = calc($a % $e)
// $d = calc($d - $f)
// $a = set($d)
// $b = set(0)
// $e = set(1)
// g:
// $d = calc($a / $e)
// $d = calc($d % 2)
// if $d >= 1 :
// $b = calc($b + 1)
// $e = calc($e * 2)
// jump g
// endif
// h:
// if $c > $b :
// if w == egg :
// 	$c = calc($c - 1)
// endif
// step(w)
// jump h
// endif
// i:
// if $c < $b :
// if e == egg :
// 	$c = calc($c + 1)
// endif
// step(e)
// jump i
// endif
// jump j
// 	`,
// }, {
// 	type: ["speed"],
// 	code: `
// f:
// if here != egg :
// step(e)
// jump f
// endif
// j:
// take(here)
// $e = calc(myitem + 1)
// a:
// if $e > 1 :
// if e == egg :
// 	$c = calc($c + 1)
// endif
// step(e)
// $e = calc($e - 1)
// jump a
// endif
// drop(here)
// $g = set(0)
// b:
// if $g < $b :
// $e = calc($e * 2)
// $g = calc($g + 1)
// jump b
// endif
// $d = calc($a % $e)
// $f = calc($a / 2)
// $f = calc($f % $e)
// $d = calc($d - $f)
// $f = calc($a / 2)
// c:
// if $g < $c :
// $e = calc($e * 2)
// $g = calc($g + 1)
// jump c
// endif
// $f = calc($f % $e)
// $d = calc($d + $f)
// $d = calc($d + $e)
// $d = calc($d + $a)
// $e = calc($e * 2)
// $f = calc($a % $e)
// $d = calc($d - $f)
// $a = set($d)
// $b = set(0)
// $e = set(1)
// g:
// $d = calc($a / $e)
// $d = calc($d % 2)
// if $d >= 1 :
// $b = calc($b + 1)
// $e = calc($e * 2)
// jump g
// endif
// h:
// if $c > $b :
// if w == egg :
// 	$c = calc($c - 1)
// endif
// step(w)
// jump h
// endif
// i:
// if $c < $b :
// if e == egg :
// 	$c = calc($c + 1)
// endif
// step(e)
// jump i
// endif
// jump j
// 	`,
// },