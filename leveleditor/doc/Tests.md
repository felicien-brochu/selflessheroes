# Tests

Tests are defined in a `tests.json` file inside the level directory.

The tests ensure that the secondary objectives of the level are achievable and
that the [CustomLossConditions](Ruleset.md#customlosscondition) work as
intended.

The `tests.json` file contains a JSON array of [Test](#Test) objects.

`tests.json` example:

```json
[
  {
    "type": ["length"],
    "code": "tests/length.txt"
  },
  {
    "type": ["speed"],
    "code": "tests/speed.txt"
  },
  {
    "type": ["lossReason"],
    "code": "tests/loss_reason_wrong_egg_in_cauldron.txt",
    "lossReason": "loss_reason_wrong_egg_in_cauldron",
  }
]
```

## Test

You can create 3 types of tests:

-   `length`: ensures the code length secondary objective is achievable.
-   `speed`: ensures the speed secondary objective is achievable.
-   `lossReason`: ensures your
    [CustomLossConditions](Ruleset.md#customlosscondition) work as intended.

:bulb: In order to publish a level on Selfless Heroes API, `tests.json` **must** contain at least 1 `speed` test, 1 `length` test and 1 `lossReason` test for
each [CustomLossCondition](Ruleset.md#customlosscondition).

For a `length` test to pass, the code provided must achieve the code length
objective every time it's tested.

For a `speed` test to pass, the code provided must achieve the speed secondary
objective frequently enough. Some of the individual tests may fail the speed
objective but each series of 20 tests must have an average speed achieving the
objective 99.9% of the time.

For a `lossReason` test to pass, the code provided must trigger the tested
[CustomLossCondition](Ruleset.md#customlosscondition) at least as frequently as
the `frequency` property dictates (see bellow).

### Properties

-   `type` [string array] list of types of the test. Possible types: `"length"`
    \| `"speed"` \| `"lossReason"`. When you have a combined solution for both
    speed and code length secondary objectives, you can create a single Test
    object with `type` set to `["length", "speed"]`. **required**

-   `code` [string] code file containing Selfless Heroes language code. The path
    must be relative to the level directory. **required**

* * *

#### Additional properties for `lossReason` tests

-   `lossReason` [string] the
    [CustomLossCondition](Ruleset.md#customlosscondition) identifier returned by
    [CustomLossCondition.getReason()](Ruleset.md#customlossconditiongetreasonworld-required).
    **required**

-   `frequency` [floating point number] the minimum frequency of the
    [CustomLossCondition](Ruleset.md#customlosscondition) appearance for the
    test to pass. **You should not change this property** except if you
    absolutely need to. It can be used for some levels where the setting is very
    random and where your [CustomLossCondition](Ruleset.md#customlosscondition)
    may not be triggered 100% of the time. `frequency` **must** be a floating
    point number in the interval ]0,1]. `0` corresponding to 0% of the time and
    `1` to 100% of the time. It **should** be set as high as possible.
    **default:** `1`
