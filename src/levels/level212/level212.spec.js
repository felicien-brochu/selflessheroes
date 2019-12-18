import level from './level212'

export default {
  level: level,
  specs: [{
    type: ["length", "speed"],
    code: `
$a = nearest(cauldron)
drop($a)
		`,
  }, ]
}