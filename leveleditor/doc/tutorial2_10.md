# Tutorial 2 - Part 10: Final test before publishing

Let's use the [`checklist`](shutils.md#checklist-command) command to check that
the level is ready for publishing.

:pushpin: This command runs extensive tests on the level so it can take several
minutes to complete.

```shell
shutils checklist levels/black_forest
```

    Check file tree
    √ map.json [exists]
    √ level.js [exists]
    √ metadata.json [exists]
    √ tests.json [exists]
    √ level.shlv [exists]

    Check metadata.json
    √ id: "black_forest" [valid]
    √ difficulty: 2 [valid]

    Check level.js
    √ messages.en.name [valid]
    √ messages.en.objective [valid]
    √ messages.en.loss_reason_wrong_egg_in_cauldron [valid]
    √ maxStep [valid]
    √ speedTarget [valid]
    √ lengthTarget [valid]

    Check tests.json
    √ length test [exists]
    √ speed test [exists]
    √ custom loss reason test (loss_reason_wrong_egg_in_cauldron) [exists]

    ===> level.shlv (Black forest)
    [OK] SPEED TEST (speed: 85 <= 85, lostRatio: 0 <= 0.002)
    [OK] LENGTH TEST (lines: 21 <= 21, lostRatio: 0 <= 0.002)
    [OK] LOSS REASON TEST loss_reason_wrong_egg_in_cauldron (frequency: 1 >= 1)

    Tests executed 3 in 4m 45.44s: pass: 3, fail: 0

    Errors: 0

:bulb: See [`shutils` manual](shutils.md) for more details on the command line
tools.

Next: [:arrow_forward: Part 11: Create an account on Selfless Heroes API](tutorial2_11.md)
