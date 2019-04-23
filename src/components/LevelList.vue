<template>
<ul class="level-list">
  <level-item v-for="level in levels"
    :key="level.id"
    :level="level" />
</ul>
</template>

<script>
import levels from '../levels/levels'
import LevelItem from './levellist/LevelItem'

export default {
  components: {
    LevelItem
  },
  props: {},
  computed: {
    levels: function() {
      return levels
    }
  }
}
</script>

<style lang="scss">
.level-list {
    color: #ABB2BF;
    background-color: #282C34;
}
</style>
