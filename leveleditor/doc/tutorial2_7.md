# Tutorial 2 - Part 7: Secondary objectives

The secondary objectives are defined in the [Level](Level.md) object by the properties `speedTarget` and `lengthTarget`.

## Advice about secondary objectives

To choose a good code length secondary objective, you should give your best to find the best solution possible and set `lengthTarget` property accordingly.

To choose a good speed secondary objective is a bit more subtle. In Selfless Heroes, you can sometimes hack your way into achieving the speed secondary objective by repeating the same instruction instead of using "jump loops". However the speed objective is not here to encourage the player to play this way. So it's a good rule of thumb to limit yourself to at most 2 same instructions in a row when you create a solution for this objective.

## Code length objective

I propose this solution for the code length objective:

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

The solution is 21 lines long. Add this to the [Level](Level.md) object.

```javascript
module.exports = {
  // mapConfig: ...
  // messages: ...

  lengthTarget: 21,

  // compilerConfig: ...
  // worldGenerator: ...
  // ruleset: ...
}
```

## Speed objective

I propose this solution for the speed objective:

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

The solution takes 84 steps to finish on average according to the game. You can get a slightly different result than mine and it's totally normal. For now, we will blindly add this to the [Level](Level.md) object. We will refine this value in the next part of this tutorial by creating tests for the level.

```javascript
module.exports = {
  // mapConfig: ...
  // messages: ...

  lengthTarget: 21,
  speedTarget: 84,

  // compilerConfig: ...
  // worldGenerator: ...
  // ruleset: ...
}
```

## Maximum number of steps

Now that we have a decent approximation of how many steps this level takes to be
solved, we can set the maximum number of steps allowed by setting `maxStep`
property in the [Level](Level.md) object. If the solution of the player takes
more steps than this value, the game will stop and show the message "Your
program takes too much time". It's a good rule of thumb to set this value to
approximately `4 * speedTarget`.

```javascript
module.exports = {
  // mapConfig: ...
  // messages: ...

  lengthTarget: 21,
  speedTarget: 84,

  maxStep: 350, //< Approximately 4 * speedTarget

  // compilerConfig: ...
  // worldGenerator: ...
  // ruleset: ...
}
```

Next: [:arrow_forward: Part 8: Tests](tutorial2_8.md)
