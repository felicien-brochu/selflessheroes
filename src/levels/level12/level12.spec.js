import level from './level12'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
a:
b:
if s == floor :
	step(s)
	jump b
endif
c:
if w == floor :
	step(w)
	jump c
endif
d:
if n == floor :
	step(n)
	jump d
endif
e:
if e == floor :
	step(e)
	jump e
endif
jump a
		`,
  }]
}