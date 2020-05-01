<template>
<div class="speed-range"
  :title="$text('run_bar_speed_range')">

  <touch-range :value="speed"
    :min="0"
    :max="maxSpeed"
    :step="1"
    @input="setSpeed"
    v-model="speed" />

  <ul class="speed-list">
    <li v-for="speedItem in speeds"
      :class="speedItem.value == speed ? 'selected' : ''">
      {{ speedItem.name }}
    </li>
  </ul>

</div>
</template>

<script>
import Speeds from '../../../game/Speeds'
import TouchRange from '../../common/TouchRange'

export default {
  components: {
    TouchRange
  },
  data: function() {
    return {
      speed: Speeds.default,
      maxSpeed: Speeds.values.length - 1
    }
  },
  computed: {
    speeds: function() {
      let speeds = []
      for (let i = 0; i < Speeds.values.length; i++) {
        speeds.push({
          name: new String(Speeds.values[i] + "x"),
          value: i
        })
      }
      return speeds
    }
  },
  methods: {
    setSpeed(index) {
      this.$emit('change', Speeds.values[index])
    },
    increaseSpeed() {
      if (this.speed < this.maxSpeed) {
        this.speed++
      }
      this.setSpeed(this.speed)
    },
    decreaseSpeed() {
      if (this.speed > 0) {
        this.speed--
      }
      this.setSpeed(this.speed)
    }
  }
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
