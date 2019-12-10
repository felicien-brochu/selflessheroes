import level from './level214'

export default {
  level: level,
  deterministic: true,
  specs: [{
    type: ["length"],
    code: `
$c = nearest(cauldron)
a:
$b = nearest(egg)
take($b)
b:
if $a < myitem :
	$a = calc($a + 1)
	jump b
endif
drop($c)
jump a
		`,
  }, {
    type: ["speed"],
    code: `
$c = nearest(cauldron)
a:
$b = nearest(egg)
take($b)
if $a == 0 :
	b:
	if myitem <= 3 &&
	  $a < myitem :
		$a = calc($a + 1)
		jump b
	endif
endif
drop($c)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_egg_order',
    frequency: 1,
    code: `
$c = nearest(cauldron)
a:
$b = nearest(egg)
take($b)
b:
if $a == myitem :
	$a = calc($a + 1)
	jump b
endif
drop($c)
jump a
		`,
  }, {
    type: ["lossReason"],
    lossReason: 'loss_reason_wrong_egg_order',
    frequency: 1,
    code: `
$c = nearest(cauldron)
a:
$b = nearest(egg)
take($b)
if $a == 0 :
	b:
	if $a < myitem :
		$a = calc($a + 1)
		jump b
	endif
endif
drop($c)
jump a
		`,
  }, ]
}