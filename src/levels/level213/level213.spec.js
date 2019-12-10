import level from './level213'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
$b = nearest(cauldron)
a:
$a = nearest(egg)
take($a)
drop($b)
jump a
		`,
  }, ]
}