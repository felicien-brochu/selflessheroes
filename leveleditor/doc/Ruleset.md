# Ruleset

Ruleset defines the rules of a level: what the player should do to win and when
he loses.

## Properties

-   `win` \[[DefaultWinCondition](#defaultwincondition) \|
    [CustomWinCondition](#customwincondition)]
    a [WinCondition](#wincondition) descriptor. See the
    [documentation about WinCondition](#wincondition) for more details.
    **required**

-   `lose` \[[LossConditions](#lossconditions)] a
    [LossConditions](#lossconditions) object. See the
    [documentation about LossConditions](#lossconditions) for more details.
    **required**

## WinCondition

WinCondition defines the victory condition of a Level. It can be either a
[DefaultWinCondition](#defaultwincondition) or a
[CustomWinCondition](#customwincondition).

### DefaultWinCondition

DefaultWinCondition are strings that refer to win conditions already implemented
into the game. If you don't want to implement a
[CustomWinCondition](#customwincondition) yourself, use these.

| keyword        | description                 |
| -------------- | --------------------------- |
| `all_switches` | All switches are triggered. |
| `all_bonfires` | All bonfires are lit.       |

### CustomWinCondition

CustomWinCondition **must** implement the method
[`CustomWinCondition.check()`](#customwinconditioncheckworld-required) and
**may** implement the methods
[`CustomWinCondition.beforeStart()`](#customwinconditionbeforestartworld) and
[`CustomWinCondition.step()`](#customwinconditionstepworld).

:bulb: Check out the [Level life cycle diagram](Level.md#life-cycle) to see when
these methods are called during the level life cycle.

* * *

#### `CustomWinCondition.check(world)` **required**

Check if the win condition is realized.

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

**Returns:** `true` if the level is won, `false` otherwise.

* * *

#### `CustomWinCondition.beforeStart(world)`

Called during the [initialization](Level.md#life-cycle) of the Level. This
method is meant to store information about the initial state of the world. It
could be considered as the "constructor" of the CustomWinCondition.

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

* * *

#### `CustomWinCondition.step(world)`

Called during the [game loop](Level.md#life-cycle) of the Level. This method is
meant to make the treatments you don't want to do in
[`CustomWinCondition.check()`](#customwinconditioncheckworld-required).

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

## LossConditions

LossConditions is an array of [LossCondition](#losscondition) separated by
`'or'` keywords:

```javascript
[lossCondition1, 'or', lossCondition2, 'or', lossCondition3]
```

At the end of each step, the game will check these conditions from the left to
the right. The first to be found `true` will be considered to be the reason why
the player has lost and a message will popup on the screen to explain to the
player why he lost.

## LossCondition

LossCondition defines a way to lose in a Level. It can be either a
[DefaultLossCondition](#defaultlosscondition) or a
[CustomLossCondition](#customlosscondition).

### DefaultLossCondition

DefaultLossCondition are strings that refer to loss conditions already
implemented into the game. If you don't want to implement a
[CustomLossCondition](#customlosscondition) yourself, use these.

| keyword          | description                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `too_many_steps` | The number of steps since the start of the game exceeds [Level.maxStep](Level.md#properties).                   |
| `all_hero_dead`  | All the heroes are dead.                                                                                        |
| `one_hero_dead`  | At least one hero is dead.                                                                                      |
| `all_hero_ended` | All the heroes are asleep: they don't have anymore instructions to execute.                                     |
| `default_loss`   | Default loss condition. It is equivalent to `['all_hero_dead', 'or', 'all_hero_ended', 'or', 'too_many_steps']` |

### CustomLossCondition

CustomLossCondition **must** implement the methods
[`CustomLossCondition.check()`](#customlossconditioncheckworld-required) and
[`CustomLossCondition.getReason()`](#customlossconditiongetreasonworld-required)
and **may** implement the methods
[`CustomLossCondition.beforeStart()`](#customlossconditionbeforestartworld) and
[`CustomLossCondition.step()`](#customlossconditionstepworld).

:bulb: Check out the [Level life cycle diagram](Level.md#life-cycle) to see when
these methods are called during the level life cycle.

* * *

#### `CustomLossCondition.check(world)` **required**

Check if the loss condition is realized.

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

**Returns:** `true` if the player lost, `false` otherwise.

* * *

#### `CustomLossCondition.getReason(world)` **required**

Returns a string which identifies which message to show to the player to explain
why he lost. You **must** create the corresponding message in
[`Level.message`](LocalizedMessages.md). See this [example](#ruleset-example)
for more details.

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

**Returns:** a string which identifies a
[LocalizedMessage](LocalizedMessages.md#required-properties) to show to the
player to explain why he lost.

* * *

#### `CustomLossCondition.beforeStart(world)`

Called during the [initialization](Level.md#life-cycle) of the Level. This
method is meant to store information about the initial state of the world. It
could be considered as the "constructor" of the CustomLossCondition.

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

* * *

#### `CustomLossCondition.step(world)`

Called during the [game loop](Level.md#life-cycle) of the Level. This method is
meant to make the treatments you don't want to do in
[`CustomLossCondition.check()`](#customlossconditioncheckworld-required).

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md)
    object.

## Ruleset example

In this example, we create a Ruleset for a Level in which the objective is to
put the egg of maximum value into a cauldron. The player loses if he puts an egg
which is not of maximum value into the cauldron.

`level.js`

```javascript
module.exports = {
  // ...

  ruleset: {
    // Use a CustomWinCondition
    win: winCondition,
    // Use a CustomLossCondition and a DefaultLossCondition.
    lose: [wrongEggInCauldronLossCondition, 'or', 'default_loss']
  },

  messages: {
    "en": {
      // ...

      // Create the message corresponding to
      // wrongEggInCauldronLossCondition CustomLossCondition
      "loss_reason_wrong_egg_in_cauldron": "You put an %%icon icon-egg$%% egg which is not the maximum into the %%icon icon-cauldron$%% cauldron."
    }
  }
}

// Helper function: returns the value of the egg which have
// the maximum value of the level.
function findMaxEggValue(world) {
  let max = -1
  for (let egg of world.eggs) {
    if (egg.value > max) {
      max = egg.value
    }
  }
  return max
}

// Implement a CustomWinCondition
const winCondition = {
  // Store the max egg value.
  beforeStart(world) {
    this.maxEggValue = findMaxEggValue(world)
  },

  // Return true if the only egg in the cauldron is an egg with maximum value.
  check(world) {
    let cauldron = world.cauldrons[0]
    return cauldron.items.length === 1 &&
           cauldron.items[0].value === this.maxEggValue
  }
}

// Implement a CustomLossCondition
const wrongEggInCauldronLossCondition = {
  // Store the max egg value.
  beforeStart(world) {
    this.maxEggValue = findMaxEggValue(world)
  },

  // Return true if at least one egg with less than maximum value
  // is in the cauldron.
  check(world) {
    let cauldron = world.cauldrons[0]

    for (let eggId of cauldron.items) {
      let egg = world.findObjectByID(eggId)
      if (egg.value < this.maxEggValue) {
        return true
      }
    }

    return false
  },

  getReason(world) {
    return 'loss_reason_wrong_egg_in_cauldron'
  }
}
```
