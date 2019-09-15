<template>
<div class="level-list">

  <div v-for="category in careerLevels"
    class="list-container">
    <div :class="[
			'side-bar',
			`category-color-${category.color}`,
		]" />
    <card-list class="list"
      :key="category.name"
      :itemWidth="280"
      :horizontalMargin="15"
      :parentPadding="30"
      ref="categories">
      <level-item v-for="level in category.levels"
        :key="level.id"
        :level="level.level"
        :locked="!level.unlocked"
        :bonus="level.bonus"
        :score="level.score"
        :class="{'selected': level.id === selectedID}"
        @mousedown.native="selectLevel(level.level.id, level.unlocked)"
        @touchstart.native="$event.preventDefault(); selectLevel(level.id, level.unlocked)" />
    </card-list>
  </div>

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
import CardList from '../common/CardList'
import storage from '../../game/storage/Storage'

export default {
  components: {
    LevelItem,
    LevelDetails,
    CardList,
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
      if (vm.$router.levelListScroll && vm.$router.levelListScroll.path !== to.path) {
        vm.$router.levelListScroll = null
      }

      if (vm.$router.levelListScroll) {
        vm.$el.scrollTop = vm.$router.levelListScroll.scrollTop
      }
      else {
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
      let category = this.$refs.categories[this.$refs.categories.length - 1].$el
      this.$el.scrollTop = category.offsetTop - 80
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

    .list-container {
        margin: 80px 0;
        display: flex;
        justify-content: center;
        align-items: stretch;

        .side-bar {
            min-width: 30px;
            border-radius: 15px 0 0 15px;
            background-color: #757b88;

            &.category-color-gray {
                background-color: #757b88;
            }

            &.category-color-blue {
                background-color: #557cca;
            }

            &.category-color-green {
                background-color: #6d9757;
            }

            &.category-color-yellow {
                background-color: #D5AF55;
            }

            &.category-color-red {
                background-color: #D03F3F;
            }

            &.category-color-purple {
                background-color: #9166BD;
            }

            &.category-color-orange {
                background-color: #D0753B;
            }
        }

        .list {
            min-width: min-content;
            flex-grow: 0;
            background-color: #333740;
            padding: 20px 25px 20px 30px;
            border-radius: 0 15px 15px 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: flex-start;
            align-content: flex-start;
        }
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
