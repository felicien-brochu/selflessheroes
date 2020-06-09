# Tutorial 2 - Part 8: Tests

In order to publish a level on Selfless Heroes API, you **must** create tests for your level. Tests are defined in `tests.json` file inside the level directory. These tests ensure the level works properly. And in addition it will enable us to set `speedTarget` to its definitive value.

:bulb: See [`tests.json` documentation](Tests.md) to better understand how to create tests.

In order to publish a level on Selfless Heroes API, `tests.json` **must** contain at least 1 `speed` test, 1 `length` test and 1 `lossReason` test for
each [CustomLossCondition](Ruleset.md#customlosscondition) you created.

## Speed test

First we create a test for the speed secondary objective.

Open `sh-leveleditor-dir/levels/black_forest/tests.json` in a text editor and write this:

`tests.json`:

```JSON
[{
  "type": ["speed"],
  "code": "tests/speed.txt"
}]
```

Create a directory named `tests` in `sh-leveleditor-dir/levels/black_forest/` and create a new file named `speed.txt` within it. This file should contain the code of the solution we want to test for the speed objective.

`tests/speed.txt`:

    if w == wall :
    	top_loop:
    	select_max_downward:
    	if myitem == nothing ||
    		e > myitem :
    		drop(here)
    		take(e)
    	endif
    	if s != wall :
    		step(s)
    		jump select_max_downward
    	endif
    	step(e)
    	step(e)
    	tell("ok" everyone)
    	step(e)
    	select_max_upward:
    	if myitem == nothing ||
    		e > myitem :
    		drop(here)
    		take(e)
    	endif
    	if n != wall :
    		step(n)
    		jump select_max_upward
    	endif
    	step(e)
    	step(e)
    	tell("ok" everyone)
    	step(e)
    	drop(e)
    	jump top_loop
    endif
    bottom_loop:
    go_to_switch:
    step(e)
    if here != switch &&
    	e == floor :
    	jump go_to_switch
    endif
    listen("ok")
    jump bottom_loop

### Executing the speed test

Execute the following command to execute this test:

```shell
shutils test-level levels/black_forest
```

:bulb: See [`shutils` manual](shutils.md) for more details on the command line
tools.

The test should fail and display something like this:

    ===> level.shlv (Black forest)
    [FAIL] SPEED TEST (speed: 85 <= 84, lostRatio: 0 <= 0.002)
        => average speed slower than speedTarget: 85 > 84

     Tests executed 1 in 19.43s: pass: 0, fail: 1

The test results indicates that `speedTarget` should be set to `85`. Modify
`level.js` accordingly.

```javascript
module.exports = {
  // mapConfig: ...
  // messages: ...

  lengthTarget: 21,
  speedTarget: 85, //< Set to the value given by the failed test

  maxStep: 350, //< Approximately 4 * speedTarget

  // compilerConfig: ...
  // worldGenerator: ...
  // ruleset: ...
}
```

Now the test should pass.

    ===> level.shlv (Black forest)
    [OK] SPEED TEST (speed: 85 <= 85, lostRatio: 0 <= 0.002)

     Tests executed 1 in 20.38s: pass: 1, fail: 0

## Code length test

`tests.json`:

```JSON
[{
  "type": ["speed"],
  "code": "tests/speed.txt"
}, {
  "type": ["length"],
  "code": "tests/length.txt"
}]
```

Create the file `length.txt` in `sh-leveleditor-dir/levels/black_forest/tests`.

`length.txt`:

    if w == wall :
    	top_loop:
    	select_max:
    	if myitem == nothing ||
    		e > myitem :
    		drop(here)
    		take(e)
    	endif
    	if s != wall :
    		step(s)
    		jump select_max
    	endif
    	go_east:
    	step(e)
    	if w != spikes :
    		jump go_east
    	endif
    	tell("ok" everyone)
    	go_north:
    	step(n)
    	if n != wall :
    		jump go_north
    	endif
    	drop(e)
    	jump top_loop
    endif
    bottom_loop:
    go_to_switch:
    step(e)
    if here != switch &&
    	e == floor :
    	jump go_to_switch
    endif
    listen("ok")
    jump bottom_loop

The tests should pass.

    ===> level.shlv (Black forest)
    [OK] SPEED TEST (speed: 85 <= 85, lostRatio: 0 <= 0.002)
    [OK] LENGTH TEST (lines: 21 <= 21, lostRatio: 0 <= 0.002)

     Tests executed 2 in 27.47s: pass: 2, fail: 0

## CustomLossCondition test

`tests.json`:

```JSON
[{
  "type": ["speed"],
  "code": "tests/speed.txt"
}, {
  "type": ["length"],
  "code": "tests/length.txt"
}, {
  "type": ["lossReason"],
  "code": "tests/loss_reason_wrong_egg_in_cauldron.txt",
  "lossReason": "loss_reason_wrong_egg_in_cauldron"
}]
```

Create the file `loss_reason_wrong_egg_in_cauldron.txt` in `sh-leveleditor-dir/levels/black_forest/tests`.

`loss_reason_wrong_egg_in_cauldron.txt`:

    if w == wall :
    	top_loop:
    	select_min:
    	if myitem == nothing ||
    		e < myitem :
    		drop(here)
    		take(e)
    	endif
    	if s != wall :
    		step(s)
    		jump select_min
    	endif
    	go_east:
    	step(e)
    	if w != spikes :
    		jump go_east
    	endif
    	tell("ok" everyone)
    	go_north:
    	step(n)
    	if n != wall :
    		jump go_north
    	endif
    	drop(e)
    	jump top_loop
    endif
    bottom_loop:
    go_to_switch:
    step(e)
    if here != switch &&
    	e == floor :
    	jump go_to_switch
    endif
    listen("ok")
    jump bottom_loop

The tests should pass.

    ===> level.shlv (Black forest)
    [OK] SPEED TEST (speed: 85 <= 85, lostRatio: 0 <= 0.002)
    [OK] LENGTH TEST (lines: 21 <= 21, lostRatio: 0 <= 0.002)
    [OK] LOSS REASON TEST loss_reason_wrong_egg_in_cauldron (frequency: 1 >= 1)

    Tests executed 3 in 27.84s: pass: 3, fail: 0

## Deterministic levels

For some levels, the tests can take a long time to run. If the level you're
working on is deterministic, meaning that nothing is random in it (no use of
	`WorldProxy.rng()` and no eggs with random values), you can set
	`deterministic` property to `true` in the [Level](Level.md) object. It will
	speed up greatly the tests execution as well as the tests in the game.

The level we're creating uses both `WorldProxy.rng()` and eggs with random
values, so let's set this property to `false`.

```javascript
module.exports = {
  // mapConfig: ...
  // messages: ...

  lengthTarget: 21,
  speedTarget: 85, //< Set to the value given by the failed test

  maxStep: 350, //< Approximately 4 * speedTarget
  deterministic: false, //< This level uses randomness

  // compilerConfig: ...
  // worldGenerator: ...
  // ruleset: ...
}
```

Next: [:arrow_forward: Part 9: Metadata](tutorial2_9.md)
