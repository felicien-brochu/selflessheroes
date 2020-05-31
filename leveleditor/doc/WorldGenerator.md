# WorldGenerator

WorldGenerator is used during the initialization process of a level (see
[level life cycle](Level.md#life-cycle)) to generate world objects in the level.

A WorldGenerator must implement a `generate()` method.

#### `generate(world)`

-   `world` \[[WorldProxy](WorldProxy.md)] the [WorldProxy](WorldProxy.md) object with object creation capabilities enabled.

## Create world objects

In the `generate()` method, you can use [`world.createObject()`](WorldProxy.md#createobjecttype-objectconfig) to create
world objects.

### Simple generator

This example creates a line of 10 [Switch](ObjectConfig.md#switchconfig).

`level.js`:

```javascript
module.exports = {
  // ...

  worldGenerator: {
    generate(world) {
      const xStart = 4
      const y = 4
      const switchCount = 10

      for (let x = xStart; x < xStart + switchCount; x++) {
        world.createObject('switch', {
          x: x,
          y: y,
          autoDisable: true
        })
      }
    }
  }
}
```

### Advanced generator: dependent objects

This example creates 10 [Switch](ObjectConfig.md#switchconfig), and 10
[Spikes](ObjectConfig.md#spikesconfig). We use the switches as triggers so that
the spikes will get disabled when all switches are enabled.

Note: we make use of a [Marker](ObjectConfig.md#markerconfig) created in Tiled
to generate all objects relative to its position. It's the intended way to use
markers. It comes in very handy when the layout of the map is not definitive.
That way you just have to move the [Marker](ObjectConfig.md#markerconfig) in
Tiled and all these objects will move accordingly.

`level.js`:

```javascript
module.exports = {
  // ...

  worldGenerator: {
    generate(world) {
      // Find the marker created with Tiled. We know that its id is 12 from Tiled.
      const marker = world.findObjectByID(12)
      const objectLineLength = 10

      // Create switches and store their ids in switchIds for later use.
      let switchIds = []

      for (let x = marker.x; x < marker.x + objectLineLength; x++) {
        let id = world.createObject('switch', {
          x: x,
          y: marker.y,
          autoDisable: true
        })

        switchIds.push(id)
      }

      // Create the spikes.
      const triggers = switchIds.join(',')

      for (let x = marker.x; x < marker.x + objectLineLength; x++) {
        world.createObject('spikes', {
          x: x,
          y: marker.y + 1,
          enabled: true,
          triggers: triggers
        })
      }
    }
  }
}
```
