<template>
<div class="level-list">

  <button class="back-button mdi mdi-chevron-left"
    type="button"
    @mousedown="goBack"
    @touchstart="goBack" />

  <ul class="list">
    <level-item v-for="level in levels"
      :key="level.id"
      :level="level.level"
      :locked="level.locked"
      :score="level.score"
      @mousedown.native="selectLevel(level.id, !level.locked)"
      @touchstart.native="selectLevel(level.id, !level.locked)" />
  </ul>
</div>
</template>

<script>
import levelManager from '../../levels/levelManager'
import LevelItem from './LevelItem'
import storage from '../../game/storage/Storage'

export default {
  components: {
    LevelItem
  },
  props: {
    careerID: {
      type: Number
    }
  },

  data: function() {
    let career = storage.getCareer(this.careerID)
    let careerLevels = levelManager.getCareerList(career)
    return {
      career: career,
      careerLevels: careerLevels
    }
  },

  computed: {
    levels: function() {
      return this.careerLevels.map(level => {
        let score = null
        let levelSolutions = this.career.getLevel(level.level.id)
        if (levelSolutions) {
          score = levelSolutions.score
        }
        return {
          id: level.level.id,
          level: level.level,
          locked: !level.unlocked,
          score: score
        }
      })
    }
  },

  created() {
    if (!this.career) {
      this.$router.replace({
        name: 'home'
      })
    }

    this.career.createUnlockedLevelSolutions(this.careerLevels)
  },

  methods: {
    selectLevel(id, unlocked) {
      if (unlocked) {
        let level = this.career.getLevel(id)
        this.$router.push({
          name: 'level',
          params: {
            careerID: this.careerID,
            levelID: id
          }
        })
      }
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
    box-sizing: border-box;
    min-height: 100vh;
    padding: 80px 40px;
    color: #ABB2BF;
    background-color: #282C34;

    .back-button {
        color: transparentize(white, 0.2);
        padding: 0;
        font-size: 60px;
        line-height: 40px;
        left: 4px;
        top: 12px;
        z-index: 5;
        background: none;
        border: none;
        outline: none;
        pointer-events: all;
        position: absolute;
        cursor: pointer;

        &:hover {
            color: white;
        }
    }

    .list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: flex-start;
        align-content: flex-start;
    }
}
</style>
