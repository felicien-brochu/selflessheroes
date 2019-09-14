<template>
<div class="level-list">

  <ul v-for="category in careerLevels"
    class="list"
    :key="category.name"
    ref="categories">
    <level-item v-for="level in category.levels"
      :key="level.id"
      :level="level.level"
      :locked="!level.unlocked"
      :score="level.score"
      :class="{'selected': level.id === selectedID}"
      @mousedown.native="selectLevel(level.level.id, level.unlocked)"
      @touchstart.native="$event.preventDefault(); selectLevel(level.id, level.unlocked)" />
  </ul>

  <transition name="fade-slide"
    appear>
    <level-details v-if="selectedID >= 0"
      :levelID="selectedID"
      :career="career"
      @close="selectedID = -1" />
  </transition>
</div>
</template>

<script>
import levelManager from '../../levels/levelManager'
import LevelItem from './LevelItem'
import LevelDetails from './LevelDetails'
import storage from '../../game/storage/Storage'

export default {
  components: {
    LevelItem,
    LevelDetails
  },
  props: {
    careerID: {
      type: Number
    }
  },

  data: function() {
    let career = storage.getCareer(this.careerID)
    let careerLevels = levelManager.getCareerList(career).filter(category => category.unlocked)
    return {
      career: career,
      careerLevels: careerLevels,
      selectedID: -1
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

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$router.levelListScroll) {
        if (vm.$router.levelListScroll.path !== to.path) {
          vm.$router.levelListScroll = null
        }
        else {
          vm.$el.scrollTop = vm.$router.levelListScroll.scrollTop
        }
      }

      if (!vm.$router.levelListScroll) {
        vm.scrollToLastCategory()
      }
    })
  },

  beforeRouteLeave(to, from, next) {
    this.$router.levelListScroll = {
      path: from.path,
      scrollTop: this.$el.scrollTop,
    }
    next()
  },

  methods: {
    selectLevel(id, unlocked) {
      if (unlocked) {
        this.selectedID = id
      }
    },

    scrollToLastCategory() {
      this.$refs.categories[this.$refs.categories.length - 1].scrollIntoView()
    }
  }
}
</script>

<style lang="scss">
.level-list {
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100vh;
    padding: 0 40px;
    color: #ABB2BF;
    background-color: #282C34;
    overflow-x: hidden;
    overflow-y: auto;

    .list {
        padding: 80px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: flex-start;
        align-content: flex-start;
    }

    .level-details {
        position: fixed;
        width: 100vw;
        height: 100%;
        top: 0;
        left: 0;

        &.fade-slide-enter-active {
            transition: opacity 0.25s ease-out;

            .level-details-modal {
                transition: all 0.25s ease-out;
            }
        }

        &.fade-slide-leave-active {
            transition: opacity 0.2s ease-out;
            .level-details-modal {
                transition: all 0.2s ease-out;
            }
        }

        &.fade-slide-enter,
        &.fade-slide-leave-to {
            opacity: 0;
            .level-details-modal {
                opacity: 0;
                transform: translateX(-50%) translateY(-50px);
            }
        }
    }

}
</style>
