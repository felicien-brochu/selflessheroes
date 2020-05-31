# Metadata

Metadata are defined in a `metadata.json` file inside the level directory.

Metadata are secondary information about a level used by Selfless Heroes API.

`metadata.json` example:

```json
{
  "id": "vertigo",
  "difficulty": 1
}
```

## Properties

All properties of `metadata.json` are **required** in order to publish a level
on the API.

-   `id` [string] the identifier of the level. You can choose whatever string
    you like as long as it complies with the following contraints:

    -   a level creator (e.g. you) cannot create 2 levels with the same `id`.
    -   must only be alphanumeric characters and underscores.
    -   must be 32 characters long at most.

    :bulb: An easy way to choose an `id` is to lowercase your title and replace
    spaces by underscores.

-   `difficulty` [integer] a difficulty rating of the level from 0 to 4:

| `difficulty` | name      | description                                                                                                             | set of instructions |
| ------------ | --------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **0**        | easy      | Tutorial or really non challenging level.                                                                               | Very limited        |
| **1**        | normal    | Quite easy to solve for beginners.                                                                                      | Limited             |
| **2**        | advanced  | Hard to solve for beginners.                                                                                            | Full                |
| **3**        | hard      | Hard to solve for programmers.                                                                                          | Full                |
| **4**        | very hard | Impossible to solve without specific computer science or mathematics knowledge: tricky data structures, algorithms etc. | Full                |

:bulb: For difficulties 2, 3 and 4 the instruction set can be limited as well.
Limiting the set of instruction is often a good way to make a harder level.
:wink:
