import level from './level205'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length", "speed"],
    code: `
$a = calc(myitem + 1)
write($a)
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_value_on_egg',
    frequency: 1,
    code: `
$a = calc(myitem + 2)
write($a)
		`,
  }, ]
}