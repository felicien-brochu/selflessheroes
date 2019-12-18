import level from './level303'

export default {
  level: level,
  specs: [{
    type: ["length"],
    code: `
if w != wall :
	listen("ok")
endif
step(ne)
tell("ok" se)
step(w)
		`,
  }, {
    type: ["speed"],
    code: `
if w != wall &&
  e != wall :
	listen("ok")
endif
step(ne)
tell("ok" se)
step(w)
tell("ok" w)
		`,
  }, ]
}