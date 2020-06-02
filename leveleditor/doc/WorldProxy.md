# WorldProxy

WorldProxy is a representation of Selfless Heroes world at a given time: the map
and the world objects.

## Properties

-   `map` \[[MapProxy](MapProxy.md)] the map of the level. See
    [MapProxy documentation](MapProxy.md) for more details.

-   `steps` [integer] the number of steps from the beginning of the game.

-   `heroes` \[[Hero](WorldObject.md#hero) array] the heroes of the level. See
    [Hero documentation](WorldObject.md#hero) for more details.

-   `switches` \[[Switch](WorldObject.md#switch) array] the switches of the
    level. See [Switch documentation](WorldObject.md#switch) for more details.

-   `bonfires` \[[Bonfire](WorldObject.md#bonfire) array] the bonfires of the
    level. See [Bonfire documentation](WorldObject.md#bonfire) for more details.

-   `cauldrons` \[[Cauldron](WorldObject.md#cauldron) array] the cauldrons of
    the level. See [Cauldron documentation](WorldObject.md#cauldron) for more
    details.

-   `spikes` \[[Spikes](WorldObject.md#spikes) array] the spikes of the level.
    See [Spikes documentation](WorldObject.md#spikes) for more details.

-   `eggs` \[[Egg](WorldObject.md#egg) array] the eggs of the level. See
    [Egg documentation](WorldObject.md#egg) for more details.

-   `symbols` \[[Symbol](WorldObject.md#symbol) array] the symbols of the level.
    See [Symbol documentation](WorldObject.md#symbol) for more details.

-   `configObjects` \[[Marker](WorldObject.md#marker) array] the config objects
    of the level. It contains the markers of the level. See
    [Marker documentation](WorldObject.md#marker) for more details.

-   `objects` \[[WorldObject](WorldObject.md) array] all world objects of the
    level. See [WorldObject documentation](WorldObject.md) for more details.

-   `objectCreationEnabled` [boolean] if true,
    [`createObject()`](#createobjecttype-objectconfig) method is available.
    This is true only when the WorldProxy is passed to
    [WorldGenerator.generate()](WorldGenerator.md#generateworld).

## Methods

#### `createObject(type, objectConfig)`

Creates a [WorldObject](WorldObject.md). This method is only available when the
WorldProxy is passed to a [WorldGenerator](WorldGenerator.md).

-   `type` [string] type of the [ObjectConfig](ObjectConfig.md). See
    [ObjectConfig documentation](ObjectConfig.md) to see the types available.

-   `objectConfig` \[[ObjectConfig](ObjectConfig.md)] configuration of the
    [WorldObject](WorldObject.md) to create. See
    [ObjectConfig documentation](ObjectConfig.md) for more details.

**Returns:** the id of the created [WorldObject](WorldObject.md).

* * *

#### `rng()`

Random number generator function. When you want to use randomness in a Selfless
Heroes level, You **must** use `WorldProxy.rng()` instead of the usual
`Math.random()`.

This function is a seeded pseudo-random number generator, meaning that it
produces pseudo-random numbers in a reproducible manner.

**Returns:** a floating-point, pseudo-random number in the range 0 to less than
1 (inclusive of 0, but not 1).

* * *

#### `findObjectByID(id)`

Find a [WorldObject](WorldObject.md) by id.

-   `id` [integer] id of the [WorldObject](WorldObject.md) to find.

**Returns:** the corresponding [WorldObject](WorldObject.md) if a WorldObject
with the given `id` exists. Otherwise, `undefined` is returned.

* * *

#### `findObjectsAt(x, y)`

Find the world objects that are at the given coordinates.

-   `x` [integer] x coordinate of the tile to search (from the left of the map,
    0 based).

-   `y` [integer] y coordinate of the tile to search (from the top of the map, 0
    based).

**Returns:** An array of [WorldObject](WorldObject.md) present on the searched
tile.
