import level from './level113'

export default {
  level: level,
  specs: [{
      type: ["length"],
      code: `
a:
step(s)
step(e)
if e > myitem &&
  n == hole ||
  w > myitem &&
  n == hole ||
  e == wall &&
  w == myitem :
	step(n)
endif
jump a
		`,
    },
    {
      type: ["speed"],
      code: `
step(s)
step(s)
step(s)
a:
if s != wall :
	step(e)
	step(s)
	step(e)
	step(s)
	step(e)
	jump a
endif
d:
step(e)
step(e)
step(e)
if e == hero &&
  e <= myitem &&
  w != hero ||
  w == hero &&
  w <= myitem &&
  e != hero ||
  e == hero &&
  e <= myitem &&
  w == hero &&
  w <= myitem ||
  e != hero &&
  w != hero ||
  n != hole ||
  s != wall :
	if e != wall ||
	  w != hero ||
	  w != myitem ||
	  n != hole ||
	  s != wall :
		jump d
	endif
endif
step(n)
    		`,
    },
    {
      type: ["lossReason"],
      lossReason: 'loss_reason_all_max_eggs_in_hole',
      frequency: 1,
      code: `
b:
step(s)
step(e)
if e != wall &&
  n != hole ||
  s != wall :
	jump b
endif
d:
step(e)
if e == hero &&
  e >= myitem &&
	w != hero ||
  w == hero &&
  w >= myitem &&
	e != hero ||
	e == hero &&
	e >= myitem &&
	w == hero &&
	w >= myitem ||
  e != hero &&
  w != hero :
	if e != wall ||
	  w != hero ||
	  w != myitem :
		jump d
	endif
endif
step(n)
		`,
    },
  ]
}