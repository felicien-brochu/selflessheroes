# ObjectConfig Reference

This reference guide lists the config objects used in Tiled maps and when
calling `world.createObject()` in a WorldGenerator.

:bulb: When working in Tiled, you don't have to set the properties `id`, `x` and
`y` since Tiled is managing them for you.

-   [![bonfire-icon](images/icons/bonfire-icon.png) BonfireConfig](#bonfireconfig)

-   [![cauldron-icon](images/icons/cauldron-icon.png) CauldronConfig](#cauldronconfig)

-   [![egg-icon](images/icons/egg-icon.png) EggConfig](#eggconfig)

-   [![hero-icon](images/icons/hero-icon.png) HeroConfig](#heroconfig)

-   [![spikes-icon](images/icons/spikes-icon.png) SpikesConfig](#spikesconfig)

-   [![switch-icon](images/icons/switch-icon.png) SwitchConfig](#switchconfig)

-   [![symbol-cross-icon](images/icons/symbol-cross-icon.png) SymbolConfig](#symbolconfig)

-   [MarkerConfig](#markerconfig)

## BonfireConfig

**type:** `bonfire`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**

-   `enabled` [boolean] if true it means the bonfire is lit. **default:**
    `false`

## CauldronConfig

**type:** `cauldron`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**

## EggConfig

**type:** `egg`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`     [integer] x coordinate from the left (0 based). **required**

-   `y`     [integer] y coordinate from the top (0 based). **required**

-   `value` [integer] \| [string] value of the egg. If it's an integer, the egg
    will have a fixed value. If it's a string it must be of the form
    `"rng(min,max)"` with min and max some integers (min &lt;= max). The value
    will be determined pseudo-randomly at the initialization of the level.
    **default:** `"rng(0,9)"`

-   `showLottery` [boolean] if true show the "egg lottery". The lottery is the
    animation showing the egg changing value randomly at the start of the level.
    If the `lottery` property is defined, uses this property to generate the
    numbers of the lottery. If no `lottery` property is defined, uses the
    `value` property instead to generate the lottery numbers. **default:**
    `false`

-   `lottery` [string] the number generator to use instead of `value` when
    `showLottery` is true. It must be of the form `"rng(min,max)"` with min and
    max some integers (min &lt;= max).

## HeroConfig

**type:** `hero`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**

-   `initialDirection` [string] the direction the hero is facing. Can be either
    `"e"` for east or `"w"` for west. **default:** `"e"`

-   `item`    [integer] the id of the egg the hero is holding.

## SpikesConfig

**type:** `spikes`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**

-   `enabled` [boolean] if true, the spikes are up. **default:** `false`

-   `triggers` [string] comma seperated list of switch ids. Read bellow for more
    details on spikes triggering system.

-   `triggersNot` [string] comma seperated list of switch ids. Read bellow for
    more details on spikes triggering system.

#### Triggering spikes

Spikes can be triggered by switches. When spikes are triggered their `enabled`
property is set to the opposite value of their initial `enabled` value. For
example if the spikes are initialized with `enabled`=`true`, then their
triggered state is `enabled`=`false`.

Use `triggers` and `triggersNot` properties to determine which switches
trigger/untrigger the spikes.

_Example:_ Let's say you make a level with 4 switches with ids 1, 2, 3 and 4. If
you set `triggers`=`"1,2"` and `triggersNot`=`"3,4"`, it means that for the
spikes to be triggered, switches 1 and 2 must be enabled and switches 3 and 4
must be disabled.

`triggered = (all_switches_in_triggers_enabled) && !(one_of_the_switches_in_triggersNot_enabled)`

## SwitchConfig

**type:** `switch`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**

-   `autoDisable` [boolean] if true the switch will auto disable itself when no
    hero is on it. **default:** `true`

-   `enabled` [boolean] if true, the switch is triggered. **default:**
    `false`

## SymbolConfig

**type:** `symbol`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**

-   `symbol`  [string] the symbol to display. Possible values: `"cross"` \|
    `"arrow_n"` \| `"arrow_e"` \| `"arrow_s"` \| `"arrow_w"` **default:**
    `"cross"`

#### Symbols

-   `"cross"`: ![symbol-cross-icon](images/icons/symbol-cross-icon.png)
-   `"arrow_n"`: ![symbol-arrow-n-icon](images/icons/symbol-arrow-n-icon.png)
-   `"arrow_e"`: ![symbol-arrow-e-icon](images/icons/symbol-arrow-e-icon.png)
-   `"arrow_s"`: ![symbol-arrow-s-icon](images/icons/symbol-arrow-s-icon.png)
-   `"arrow_w"`: ![symbol-arrow-w-icon](images/icons/symbol-arrow-w-icon.png)

## MarkerConfig

**type:** `marker`

-   `id`      [integer] if no `id` is given, an available id will be created for
    the created object.

-   `x`       [integer] x coordinate from the left (0 based). **required**

-   `y`       [integer] y coordinate from the top (0 based). **required**
