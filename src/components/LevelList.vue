<template>
<div class="level-list">

  <button class="back-button material-icons"
    type="button"
    @mousedown="goBack"
    @touchstart="goBack">arrow_back_ios</button>

  <ul class="list">
    <level-item v-for="level in levels"
      :key="level.id"
      :level="level"
      @mousedown.native="selectLevel(level.id)"
      @touchstart.native="selectLevel(level.id)" />
  </ul>
</div>
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
    this.career = storage.getCareer(this.careerID)
    if (!this.career) {
      this.$router.replace({
        name: 'home'
      })
    }
  },

  methods: {
    selectLevel(id) {
      let level = this.career.getLevel(id)
      if (!level) {
        this.career.createLevel(id)
      }
      this.$router.push({
        name: 'level',
        params: {
          careerID: this.careerID,
          levelID: id
        }
      })
    },

    goBack() {
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<style lang="scss">
.level-list {
    margin: 0 auto;
    height: 100vh;
    padding: 80px 40px;
    color: #ABB2BF;
    background-color: #282C34;

    .back-button {
        color: transparentize(white, 0.2);
        background: none;
        border: none;
        outline: none;
        pointer-events: all;
        font-size: 36px;
        z-index: 5;
        position: absolute;
        left: 20px;
        top: 16px;
        cursor: pointer;

        &:hover {
            color: white;
        }
    }

    .list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            margin-left: 20px;
            transition: transform 0.2s ease;

            &:hover {
                transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                transform-origin: 66% 50%;
                transform: rotate(-1.5deg);
            }
        }
    }
}
</style>
