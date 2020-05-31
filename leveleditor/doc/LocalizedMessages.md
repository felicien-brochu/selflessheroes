# LocalizedMessages

LocalizedMessages contains localized messages to be displayed in a level.

## Example

```javascript
{
  "en": {
    "name": "Picking",
    "objective": "Put one %%icon icon-egg$%% egg which is less than 4\ninto each %%icon icon-cauldron$%% cauldron\n\n%%icon mdi mdi-information-outline$%% If you want to test the value of an %%icon icon-egg$%% egg which is on the floor, you can use a %%icon icon-direction$%% direction. Your heroes are smart enough to understand that you're talking about the %%icon icon-egg$%% egg.",
    "loss_reason_one_egg_ge_4": "You put an %%icon icon-egg$%% egg greater or equal to 4\nin a %%icon icon-cauldron$%% cauldron"
  },
  "fr": {
    "name": "Cueillette",
    "objective": "Mets un %%icon icon-egg$%% œuf inférieur à 4\ndans chaque %%icon icon-cauldron$%% chaudron\n\n%%icon mdi mdi-information-outline$%% Si tu veux tester la valeur d'un %%icon icon-egg$%% œuf qui est sur le sol, tu peux utiliser une %%icon icon-direction$%% direction. Tes héros sont assez intelligents pour comprendre que tu parles de l'%%icon icon-egg$%% œuf.",
    "loss_reason_one_egg_ge_4": "Tu as mis un %%icon icon-egg$%% œuf supérieur ou égal à 4\ndans un %%icon icon-cauldron$%% chaudron"
  }
}
```

## Supported languages

The first level of properties are language code keys. For now, Selfless Heroes
is supporting the following languages:

| Language code (ISO 639-1) | Language   | Status                       |
| ------------------------- | ---------- | ---------------------------- |
| de                        | German     | :white_check_mark: supported |
| en                        | English    | :white_check_mark: supported |
| es                        | Spanish    | :white_check_mark: supported |
| fr                        | French     | :white_check_mark: supported |
| pl                        | Polish     | :white_check_mark: supported |
| pt                        | Portuguese | :white_check_mark: supported |
| ar                        | Arabic     | :loop: work in progress      |
| eo                        | Esperanto  | :loop: work in progress      |
| it                        | Italian    | :loop: work in progress      |
| ru                        | Russian    | :loop: work in progress      |

If you would like to see your own language added to this list, contact me on
[Discord](https://discord.gg/UtKrrBM). :wink:

## Required properties

English (en) being the default language of the game, the `en` key is required.
Other languages are not. That said, it would be much appreciated to have other
languages supported too for your level. You can even provide translations in
languages that are not supported by Selfless Heroes yet, hoping that it will be
supported in the future.

Required properties of a language object:

-   `name` [string] title of the level. **required**

-   `objective` \[[SelflessHeroesString](#selflessheroesstring)] objective of
    the level. **required**

-   1 property by
    [CustomLossCondition](Ruleset.md#customlossconditiongetreasonworld-required).
    \[[SelflessHeroesString](#selflessheroesstring)] **required**

## SelflessHeroesString

`objective` and loss reason properties use SelflessHeroesString notation. It
allows the use of icons and styling in messages.

The general form is `%%style$text%%` with `style` and `text` varying according
to your needs.

### Icons

| Icon                                                      | Name           | Notation                                  |
| --------------------------------------------------------- | -------------- | ----------------------------------------- |
| ![information](images/icons/information-outline-icon.png) | information    | `%%icon mdi mdi-information-outline$%%`   |
| ![warning](images/icons/alert-octagon-outline-icon.png)   | warning        | `%%icon mdi mdi-alert-octagon-outline$%%` |
| ![hero](images/icons/hero-icon.png)                       | hero           | `%%icon icon-hero$%%`                     |
| ![bonfire](images/icons/bonfire-icon.png)                 | bonfire        | `%%icon icon-bonfire$%%`                  |
| ![cauldron](images/icons/cauldron-icon.png)               | cauldron       | `%%icon icon-cauldron$%%`                 |
| ![egg](images/icons/egg-icon.png)                         | egg            | `%%icon icon-egg$%%`                      |
| ![spikes](images/icons/spikes-icon.png)                   | spikes         | `%%icon icon-spikes$%%`                   |
| ![switch](images/icons/switch-icon.png)                   | switch         | `%%icon icon-switch$%%`                   |
| ![switch-red](images/icons/switch-red-icon.png)           | switch-red     | `%%icon icon-switch-red$%%`               |
| ![floor](images/icons/floor-icon.png)                     | floor          | `%%icon icon-floor$%%`                    |
| ![wall](images/icons/wall-icon.png)                       | wall           | `%%icon icon-wall$%%`                     |
| ![hole](images/icons/hole-icon.png)                       | hole           | `%%icon icon-hole$%%`                     |
| ![infected](images/icons/infected-icon.png)               | infected       | `%%icon icon-infected$%%`                 |
| ![npc](images/icons/npc-icon.png)                         | npc            | `%%icon icon-npc$%%`                      |
| ![myitem](images/icons/myitem-icon.png)                   | myitem         | `%%icon icon-myitem$%%`                   |
| ![number](images/icons/number-icon.png)                   | number         | `%%icon icon-number$%%`                   |
| ![variable](images/icons/variable-icon.png)               | variable       | `%%icon icon-variable$%%`                 |
| ![nothing](images/icons/nothing-icon.png)                 | nothing        | `%%icon icon-nothing$%%`                  |
| ![direction](images/icons/direction-icon.png)             | direction      | `%%icon icon-direction$%%`                |
| ![everyone](images/icons/everyone-icon.png)               | everyone       | `%%icon icon-everyone$%%`                 |
| ![message-coffee](images/icons/message-coffee-icon.png)   | message-coffee | `%%icon icon-message-coffee$%%`           |
| ![message-hey](images/icons/message-hey-icon.png)         | message-hey    | `%%icon icon-message-hey$%%`              |
| ![message-ho](images/icons/message-ho-icon.png)           | message-ho     | `%%icon icon-message-ho$%%`               |
| ![message-kiss](images/icons/message-kiss-icon.png)       | message-kiss   | `%%icon icon-message-kiss$%%`             |
| ![message-lol](images/icons/message-lol-icon.png)         | message-lol    | `%%icon icon-message-lol$%%`              |
| ![message-ok](images/icons/message-ok-icon.png)           | message-ok     | `%%icon icon-message-ok$%%`               |
| ![message-stop](images/icons/message-stop-icon.png)       | message-stop   | `%%icon icon-message-stop$%%`             |
| ![message-wait](images/icons/message-wait-icon.png)       | message-wait   | `%%icon icon-message-wait$%%`             |

### Styles

| Styled text                                                                        | Name                | Notation                                 |
| ---------------------------------------------------------------------------------- | ------------------- | ---------------------------------------- |
| ![text-style-branching-statement](images/icons/text-style-branching-statement.png) | branching-statement | `%%statement branching-statement$text%%` |
| ![text-style-action-statement](images/icons/text-style-action-statement.png)       | action-statement    | `%%statement action-statement$text%%`    |
| ![text-style-assign-statement](images/icons/text-style-assign-statement.png)       | assign-statement    | `%%statement assign-statement$text%%`    |
| ![text-style-speach-statement](images/icons/text-style-speach-statement.png)       | speach-statement    | `%%statement speach-statement$text%%`    |
| ![text-style-level-title](images/icons/text-style-level-title.png)                 | level-title         | `%%level-title$text%%`                   |
