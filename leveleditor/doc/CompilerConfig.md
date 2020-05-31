# CompilerConfig

CompilerConfig defines what part of the Selfless Heroes language can be used by
the player to solve the level.

## Properties

-   `excludePrimary` [string array] list of primary statements keywords to be
    forbidden in the level. See the
    [documentation on primary statements](#primary-statements) for more details
    on the keywords that can get into this array. **required**

-   `valueFunctions` [string array] list of value functions keywords available
    in the level. See the [documentation on value functions](#value-functions)
    for more details on the keywords that can get into this array. **default:**
    `[]`

-   `actionFunctions` [string array] list of action functions keywords available
    in the level. See the [documentation on action functions](#action-functions)
    for more details on the keywords that can get into this array. **required**

-   `leftComparisonExpressions` [string array] defines which expression types
    are available for the left part of `if` comparisons. See the
    [documentation about expression types](#expression-types) for more details
    on the keywords that can get into this array. These types will be displayed
    in the left dropdown menu of the `if` block in the same order as you specify
    them in this array. **required**

-   `rightComparisonExpressions` [string array] defines which expression types
    are available for the right part of `if` comparisons. See the
    [documentation about expression types](#expression-types) for more details
    on the keywords that can get into this array. These types will be displayed
    in the right dropdown menu of the `if` block in the same order as you
    specify them in this array. **required**

-   `forbiddenExpressions` [string array] defines which expression types are
    forbidden in the level. See the
    [documentation about expression types](#expression-types) for more details
    on the keywords that can get into this array. **default:** `[]`

-   `terrainTypes` [string array] defines which terrain types are available in
    the level. See the [documentation about terrain types](#terrain-types) for
    more details on the keywords that can get into this array. These types will
    be displayed in the dropdown menu of the `if` block in the same order as you
    specify them in this array. **required**

-   `objectTypes` [string array] defines which terrain types are available in
    the level. See the [documentation about object types](#object-types) for
    more details on the keywords that can get into this array. These types will
    be displayed in the dropdown menu of the `if` block in the same order as you
    specify them in this array. **required**

-   `variables` [integer] number of variables available in the level. Maximum
    value: `26`. **default:** `0`

-   `messages` [integer] number of different messages available in the level.
    Maximum value: `8`. **default:** `0`

-   `minInteger` [integer] minimum value of integer literals in the level.
    **default:** `0`

-   `maxInteger` [integer] maximum value of integer literals in the level.
    **default:** `99`

-   `cloneIsDeadly` [boolean] if `true`, when a hero tries to create a clone on
    a square already occupied (by a hero, a cauldron etc.) or on a forbidden
    square (like a wall), the hero will die. **default:** `false`

## Primary statements

Primary statements are the different types of statements of first level in
Selfless Heroes language.

| keyword  | description                                                                            |
| -------- | -------------------------------------------------------------------------------------- |
| `if`     | if statement                                                                           |
| `else`   | else statement                                                                         |
| `endif`  | endif statement                                                                        |
| `jump`   | jump statement                                                                         |
| `clone`  | clone statement                                                                        |
| `anchor` | anchors are labels used with clone and jump. example: `a:`                             |
| `assign` | assignment statement: anything like `$a = function()`.                                 |
| `action` | action functions: all functions that are not used in an assignment. example: `step()`. |

## Functions

### Value functions

Value functions are functions that return a value.

| keyword   | usage               |
| --------- | ------------------- |
| `set`     | `$a = set(1)`       |
| `calc`    | `$a = calc($b + 1)` |
| `nearest` | `$a = nearest(egg)` |

### Action functions

Action functions are functions that don't return any value.

| keyword    | usage                  |
| ---------- | ---------------------- |
| `step`     | `step(e)`              |
| `fireball` | `fireball(e)`          |
| `take`     | `take(e)`              |
| `drop`     | `drop(e)`              |
| `write`    | `write(1)`             |
| `tell`     | `tell("hey" everyone)` |
| `listen`   | `listen("hey")`        |

## Expressions

### Expression types

| keyword        | description                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| `terrain_type` | Terrain type: see [the documentation about terrain types](#terrain-types) for more details. |
| `object_type`  | Object type: see [the documentation about object types](#object-types) for more details.    |
| `direction`    | Direction type: see [the documentation about directions](#directions) for more details.     |
| `integer`      | Integer number type. ![integer icon](images/icons/number-icon.png)                          |
| `variable`     | Variable type. ![variable icon](images/icons/variable-icon.png)                             |
| `myitem`       | myitem type. ![myitem icon](images/icons/myitem-icon.png)                                   |
| `everyone`     | everyone type. ![everyone icon](images/icons/everyone-icon.png)                             |
| `message`      | Message type: see [the documentation about messages](#messages) for more details.           |

### Terrain types

| keyword    | ico                                              |
| ---------- | ------------------------------------------------ |
| `floor`    | ![floor icon](images/icons/floor-icon.png)       |
| `wall`     | ![wall icon](images/icons/wall-icon.png)         |
| `hole`     | ![hole icon](images/icons/hole-icon.png)         |
| `infected` | ![infected icon](images/icons/infected-icon.png) |

### Object types

| keyword    | ico                                              |
| ---------- | ------------------------------------------------ |
| `nothing`  | ![nothing icon](images/icons/nothing-icon.png)   |
| `hero`     | ![hero icon](images/icons/hero-icon.png)         |
| `npc`      | ![npc icon](images/icons/npc-icon.png)           |
| `switch`   | ![switch icon](images/icons/switch-icon.png)     |
| `bonfire`  | ![bonfire icon](images/icons/bonfire-icon.png)   |
| `cauldron` | ![cauldron icon](images/icons/cauldron-icon.png) |
| `spikes`   | ![spikes icon](images/icons/spikes-icon.png)     |
| `egg`      | ![egg icon](images/icons/egg-icon.png)           |

### Directions

| keyword | name      |
| ------- | --------- |
| `here`  | here      |
| `e`     | east      |
| `s`     | south     |
| `w`     | west      |
| `n`     | north     |
| `nw`    | northwest |
| `ne`    | northeast |
| `se`    | southeast |
| `sw`    | southwest |

### Messages

| keyword    | ico                                                          |
| ---------- | ------------------------------------------------------------ |
| `"hey"`    | ![message hey icon](images/icons/message-hey-icon.png)       |
| `"lol"`    | ![message lol icon](images/icons/message-lol-icon.png)       |
| `"ho"`     | ![message ho icon](images/icons/message-ho-icon.png)         |
| `"kiss"`   | ![message kiss icon](images/icons/message-kiss-icon.png)     |
| `"stop"`   | ![message stop icon](images/icons/message-stop-icon.png)     |
| `"wait"`   | ![message wait icon](images/icons/message-wait-icon.png)     |
| `"ok"`     | ![message ok icon](images/icons/message-ok-icon.png)         |
| `"coffee"` | ![message coffee icon](images/icons/message-coffee-icon.png) |
