<template>
<div class="speed-range">
  <touch-range :value="speed" :min="0" :max="maxSpeed" step="1" @input="$emit('change', $event)" v-model="speed" />
  <ul class="speed-list">
    <li v-for="speedItem in speeds" :class="speedItem.value == speed ? 'selected' : ''">
      {{ speedItem.name }}
    </li>
  </ul>
</div>
</template>

<script>
import Speeds from '../scenes/Speeds'
import TouchRange from './TouchRange'
import lang from '../lang'

export default {
  components: {
    TouchRange
  },
  data: function() {
    let speeds = []
    for (let i = 0; i < Speeds.values.length; i++) {
      speeds.push({
        name: new String(Speeds.values[i] + "x"),
        value: i
      })
    }
    return {
      speed: Speeds.default,
      speeds: speeds,
      maxSpeed: Speeds.values.length - 1
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.speed-range {

    input[type=range] {
        margin: auto;
    }

    .speed-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: rgb(111, 111, 111);
        padding: 0;
        margin: 6px 0 0;
        li {
            // width: 20px;
            height: 15px;
            line-height: 15px;
            list-style: none;
            font-size: 10px;
            text-align: center;

            &.selected {
                font-size: 15px;
                font-weight: bold;
                color: white;
            }
        }
    }
}
</style>
