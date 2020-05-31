# WorldObject

This reference guide lists the different WorldObject types of the game.

-   [![bonfire-icon](images/icons/bonfire-icon.png) Bonfire](#bonfire)

-   [![cauldron-icon](images/icons/cauldron-icon.png) Cauldron](#cauldron)

-   [![egg-icon](images/icons/egg-icon.png) Egg](#egg)

-   [![hero-icon](images/icons/hero-icon.png) Hero](#hero)

-   [![spikes-icon](images/icons/spikes-icon.png) Spikes](#spikes)

-   [![switch-icon](images/icons/switch-icon.png) Switch](#switch)

-   [![symbol-cross-icon](images/icons/symbol-cross-icon.png) Symbol](#symbol)

-   [Marker](#marker)

## Bonfire

-   `type`    [string] type of this WorldObject. Always set to `"bonfire"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `enabled` [boolean] if `true` it means the bonfire is lit.

## Cauldron

-   `type`    [string] type of this WorldObject. Always set to `"cauldron"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `items`   [integer array] array of item ids (e.g. Egg ids) which have been
    put into the Cauldron.

## Egg

-   `type`    [string] type of this WorldObject. Always set to `"egg"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `value`   [integer] value of the Egg.

-   `ownerID` [integer] id of the Hero owning it if there is one. `null`
    otherwise.

## Hero

-   `type`    [string] type of this WorldObject. Always set to `"hero"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `dead`    [boolean] dead state of the Hero.

-   `deathReason` [string] if the hero is dead, this property gives the reason
    why. Possible values: `"fall_character_death_reason"` \|
    `"infected_character_death_reason"` \| `"spikes_character_death_reason"` \|
    `"burnt_character_death_reason"` \| `"touched_enemy_character_death_reason"`
    \| `"failed_cloning_character_death_reason"`

-   `item`    [integer] the [Egg](#egg) the character is holding if there is
    one. `null` otherwise.

-   `ended`   [boolean] if `true` it means the Hero has no more instructions to
    execute: he is sleeping.

## Spikes

-   `type`    [string] type of this WorldObject. Always set to `"spikes"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `enabled` [boolean] if `true`, the spikes are up.

-   `triggers` [integer array] array of Switch ids that are used to trigger
    these Spikes. See [the documentation about triggering Spikes](ObjectConfig.md#triggering-spikes)
    for more details.

-   `triggersNot` [integer array] array of Switch ids that are used to untrigger
    these Spikes. See [the documentation about triggering Spikes](ObjectConfig.md#triggering-spikes)
    for more details.

## Switch

-   `type`    [string] type of this WorldObject. Always set to `"switch"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `autoDisable` [boolean] if `true` the switch auto disables itself when no
    hero is on it.

-   `enabled` [boolean] if `true`, the switch is triggered.

## Symbol

Describes a Symbol which will be displayed on top of the map.

-   `type`    [string] type of this WorldObject. Always set to `"symbol"`.

-   `id`      [integer] unique id of this WorldObject.

-   `removed` [boolean] if `true` it means that this WorldObject is no longer
    part of the game.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).

-   `symbol`  [string] the symbol displayed. Possible values: `"cross"` \|
    `"arrow_n"` \| `"arrow_e"` \| `"arrow_s"` \| `"arrow_w"`

#### Symbols

-   `"cross"`: ![symbol-cross-icon](images/icons/symbol-cross-icon.png)
-   `"arrow_n"`: ![symbol-arrow-n-icon](images/icons/symbol-arrow-n-icon.png)
-   `"arrow_e"`: ![symbol-arrow-e-icon](images/icons/symbol-arrow-e-icon.png)
-   `"arrow_s"`: ![symbol-arrow-s-icon](images/icons/symbol-arrow-s-icon.png)
-   `"arrow_w"`: ![symbol-arrow-w-icon](images/icons/symbol-arrow-w-icon.png)

## Marker

A marker is an invisible object. It does not interact with any other object in
the game. It's used mainly as a help to build other objects. Check out
[this example](WorldGenerator.md#advanced-generator-dependent-objects) where
it's used as a reference point to build other objects programmatically.

-   `type`    [string] type of this WorldObject. Always set to `"marker"`.

-   `id`      [integer] unique id of this WorldObject.

-   `x`       [integer] x coordinate from the left (0 based).

-   `y`       [integer] y coordinate from the top (0 based).
