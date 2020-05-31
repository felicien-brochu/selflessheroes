# MapProxy

MapProxy is a representation of the map of a level. It contains information
about the types of terrain on the map.

## Methods

#### `getWidth()`

**Returns:** the width of the map.

* * *

#### `getHeight()`

**Returns:** the height of the map.

* * *

#### `isFloor(x, y)`

-   `x` [integer] x coordinate of the tile (from the left of the map, 0 based).

-   `y` [integer] y coordinate of the tile (from the top of the map, 0 based).

**Returns:** `true` if the terrain type at the given coordinates is floor.
Otherwise, returns `false`.

* * *

#### `isWall(x, y)`

-   `x` [integer] x coordinate of the tile (from the left of the map, 0 based).

-   `y` [integer] y coordinate of the tile (from the top of the map, 0 based).

**Returns:** `true` if the terrain type at the given coordinates is wall.
Otherwise, returns `false`.

* * *

#### `isHole(x, y)`

-   `x` [integer] x coordinate of the tile (from the left of the map, 0 based).

-   `y` [integer] y coordinate of the tile (from the top of the map, 0 based).

**Returns:** `true` if the terrain type at the given coordinates is hole.
Otherwise, returns `false`.

* * *

#### `isInfected(x, y)`

-   `x` [integer] x coordinate of the tile (from the left of the map, 0 based).

-   `y` [integer] y coordinate of the tile (from the top of the map, 0 based).

**Returns:** `true` if the terrain type at the given coordinates is infected.
Otherwise, returns `false`.
