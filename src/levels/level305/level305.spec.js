import level from './level305'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
$a = calc(myitem % 2)
if s == cauldron :
	if $a == 0 :
		listen("hey")
	else
		listen("ho")
	endif
	drop(s)
endif
if $a == 0 :
	tell("hey" everyone)
endif
tell("ho" everyone)
		`,
  }, ]
}