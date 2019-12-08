import level from './level401'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
b:
a:
d:
if ne != hero &&
  ne == floor ||
  nw != hero &&
  nw == floor :
	clone ne d
	clone nw a
endif
c:
if sw != hero &&
  sw == floor :
	clone sw b
endif
if se != hero &&
  se == floor :
	clone se c
endif
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_floor_cell',
    frequency: 1,
    code: `
c:
b:
a:
d:
if se != hero &&
  se == floor :
	clone se d
endif
if sw != hero &&
  sw == floor :
	clone sw a
endif
if nw != hero &&
  nw == floor :
	clone nw b
endif
clone ne c
		`,
  }, ]
}