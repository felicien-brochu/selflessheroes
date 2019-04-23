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
import storage from '../game/storage/Storage'

export default {
  components: {
    LevelItem
  },
  props: {
    careerID: {
      type: Number
    }
  },
  computed: {
    levels: function() {
      return levels
    }
  },
  mounted() {
    let career = storage.getCareer(this.careerID)
    if (!career) {
      this.$router.replace('/')
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
