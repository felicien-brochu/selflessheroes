# Tutorial 2 - Part 12: Publish a level on the API

We are now ready to publish the level on the API for review. We use the
`push-level` command:

```shell
shutils push-level levels/black_forest
```

Fill in your credentials to login into the API. Then the `checklist` tests are
run onto the level. These tests can take several minutes to complete. If all
tests pass, the level is uploaded onto the API.

    √ email ... tutorialemail@example.com
    √ password ... *****************
    Login successful


     Checklist

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


     Tests executed 3 in 4m 58.45s: pass: 3, fail: 0


     Errors: 0
    Level uploaded successfully.

     Your level will be reviewed as soon as possible.
     Thank you for your contribution! :)

Congratulations! :sparkles: You uploaded a complete level on the API! :ok_hand:
