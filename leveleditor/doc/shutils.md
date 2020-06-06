# shutils manual

`shutils` is the command line tool to create, test and publish Selfless Heroes
levels.

Usage: `shutils <command>`

Available commands:

-   [`pack-level`](#pack-level-command): create a Selfless Heroes level (.shlv).
-   [`test-level`](#test-level-command): run a level tests.
-   [`checklist`](#checklist-command): check level files requirements and tests.
-   [`push-level`](#push-level-command): upload a level on Selfless Heroes API
    for review.
-   [`register`](#register-command): create a user account for Selfless Heroes
    API.

* * *

### `pack-level` command

`pack-level` packages a Selfless Heroes level named `level.shlv` into the level
directory.

Usage: `shutils pack-level <level-directory> [--options]`

| option    | short | description                                                                                                                |
| --------- | ----- | -------------------------------------------------------------------------------------------------------------------------- |
| `--help`  | `-h`  | Show help message                                                                                                          |
| `--watch` | `-w`  | Watch changes of `level.js`, `map.json` and `metadata.json` and repackages the level as soon as one of these files changes |

* * *

### `test-level` command

`test-level` runs the level tests.

Usage: `shutils test-level <level-directory> [--options]`

| option                    | short | description                                                |
| ------------------------- | ----- | ---------------------------------------------------------- |
| `--help`                  | `-h`  | Show help message                                          |
| `--fast`                  | `-F`  | Execute fast tests (`-s 100 -c 20 -l 20`)                  |
| `--slow`                  | `-S`  | Execute slow tests (`-s 20000 -c 5000 -l 1000`)            |
| `--speed-sample-size`     | `-s`  | Sample size for speed tests (default: `2000`)              |
| `--length-sample-size`    | `-c`  | Sample size for code length tests (default: `500`)         |
| `--loss-sample-size`      | `-l`  | Sample size for loss reason tests (default: `20`)          |
| `--speed-confidence`      |       | Speed tests minimum confidence in speed (default: `0.999`) |
| `--speed-lost-tolerance`  |       | Speed tests losses tolerance ratio (default: `0.002`)      |
| `--length-lost-tolerance` |       | Length tests losses tolerance ratio (default: `0.002`)     |

* * *

### `checklist` command

`checklist` checks level files requirements and tests. Execute tests as the
command [`shutils test-level --slow`](#test-level-command) would do.

Usage: `shutils checklist <level-directory> [--options]`

| option   | short | description       |
| -------- | ----- | ----------------- |
| `--help` | `-h`  | Show help message |

* * *

### `push-level` command

`push-level` tests and uploads a level on Selfless Heroes API for review. It
runs tests as the command [`shutils checklist`](#checklist-command) would do
before uploading.

Usage: `shutils push-level <level-directory> [--options]`

| option   | short | description       |
| -------- | ----- | ----------------- |
| `--help` | `-h`  | Show help message |

* * *

### `register` command

`register` creates a user account for Selfless Heroes API.

Usage: `shutils register [--options]`

| option         | short | description                                   |
| -------------- | ----- | --------------------------------------------- |
| `--help`       | `-h`  | Show help message                             |
| `--send-email` |       | Send an activation code at your email address |
| `--activate`   |       | Activate an account with an activation code   |
