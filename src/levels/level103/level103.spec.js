import level from './level103'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
a:
take(w)
take(n)
drop(e)
drop(s)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
if n == wall &&
  s == wall :
	a:
	take(w)
	drop(e)
	jump a
else
	if w == wall &&
	  e == wall :
		b:
		take(n)
		drop(s)
		jump b
	else
		c:
		take(w)
		drop(s)
		jump c
	endif
endif
		`,
  }, ]
}