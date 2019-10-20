import level from './level208'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
j:
take(here)
$e = set(myitem)
a:
if $e > 0 :
	if e == egg :
		$c = calc($c + 1)
	endif
	step(e)
	$e = calc($e - 1)
	jump a
endif
drop(here)
$e = set(1)
$g = set(1)
b:
if $g <= $b :
	$e = calc($e * 2)
	$g = calc($g + 1)
	jump b
endif
$d = calc($a % $e)
$f = calc($a / 2)
$f = calc($f % $e)
$d = calc($d - $f)
$f = calc($a / 2)
$g = set($b)
c:
if $g < $c :
	$e = calc($e * 2)
	$g = calc($g + 1)
	jump c
endif
$f = calc($f % $e)
$d = calc($d + $f)
$d = calc($d + $e)
$d = calc($d + $a)
$e = calc($e * 2)
$f = calc($a % $e)
$d = calc($d - $f)
$a = set($d)
$b = set(0)
$e = set(1)
g:
$d = calc($a / $e)
$d = calc($d % 2)
if $d >= 1 :
	$b = calc($b + 1)
	$e = calc($e * 2)
	jump g
endif
h:
if $c > $b :
	if w == egg :
		$c = calc($c - 1)
	endif
	step(w)
	jump h
endif
i:
if $c < $b :
	if e == egg :
		$c = calc($c + 1)
	endif
	step(e)
	jump i
endif
jump j
		`,
  }, {
    type: ["speed"],
    code: `
f:
if here != egg :
	step(e)
	jump f
endif
j:
take(here)
$e = set(myitem)
a:
if $e > 0 :
	if e == egg :
		$c = calc($c + 1)
	endif
	step(e)
	$e = calc($e - 1)
	jump a
endif
drop(here)
$e = set(1)
$g = set(1)
b:
if $g <= $b :
	$e = calc($e * 2)
	$g = calc($g + 1)
	jump b
endif
$d = calc($a % $e)
$f = calc($a / 2)
$f = calc($f % $e)
$d = calc($d - $f)
$f = calc($a / 2)
$g = set($b)
c:
if $g < $c :
	$e = calc($e * 2)
	$g = calc($g + 1)
	jump c
endif
$f = calc($f % $e)
$d = calc($d + $f)
$d = calc($d + $e)
$d = calc($d + $a)
$e = calc($e * 2)
$f = calc($a % $e)
$d = calc($d - $f)
$a = set($d)
$b = set(0)
$e = set(1)
g:
$d = calc($a / $e)
$d = calc($d % 2)
if $d >= 1 :
	$b = calc($b + 1)
	$e = calc($e * 2)
	jump g
endif
h:
if $c > $b :
	if w == egg :
		$c = calc($c - 1)
	endif
	step(w)
	jump h
endif
i:
if $c < $b :
	if e == egg :
		$c = calc($c + 1)
	endif
	step(e)
	jump i
endif
jump j
		`,
  }, ]
}