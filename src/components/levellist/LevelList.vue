<template>
<div class="level-list">
  <modal-layer ref="modalLayer"
    :autoBlur="true" />

  <header></header>

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
        ref="levelItems"
        :key="'level' + level.id"
        :level="level.level"
        :locked="!level.unlocked"
        :newlyUnlocked="level.newlyUnlocked"
        :revealed="level.revealed"
        :bonus="level.bonus"
        :boss="level.boss"
        :bossName="level.bossName"
        :score="level.score"
        :class="{'selected': level.id === selectedID}"
        @show-score-animation-end="handleShowScoreAnimationEnd"
        @mousedown.native="selectLevel(level.level.id, level.unlocked)" />
    </card-list>
  </div>

  <div v-if="!isPremium()"
    class="premium-levels-button-container">
    <button type="button"
      class="premium-levels-button"
      :title="$text('level_list_premium_levels_button')"
      @click.prevent.stop="showPremiumModal">{{$text('level_list_premium_levels_button')}}</button>
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
import PremiumModal from './PremiumModal'
import UnlockPremiumModal from './UnlockPremiumModal'
import ModalLayer from '../modal/ModalLayer'
import Modal from '../modal/Modal'
import storage from '../../game/storage/Storage'
import SmoothScrollTo from '../util/SmoothScrollTo'

export default {
  metaInfo: (vm) => {
    return {
      title: vm.$text('title_levellist'),
    }
  },
  components: {
    LevelItem,
    LevelDetails,
    CardList,
    ModalLayer,
  },
  props: {
    careerID: {
      type: Number
    }
  },

  data: function() {
    let career = storage.getCareer(this.careerID)
    let careerLevels = levelManager.getCareerList(career, storage.isPremium)
    this.createdLevels = career.createUnlockedLevelSolutions(careerLevels)
    this.scoreAnimationsPlaying = 0
    for (let category of careerLevels) {
      for (let level of category.levels) {
        level.newlyUnlocked = this.createdLevels.some(lvl => level.id === lvl.id)
        level.revealed = level.unlocked && !level.newlyUnlocked
        if (level.solutions) {
          if (level.solutions.score.hasToShowScore(level.level)) {
            this.scoreAnimationsPlaying++
          }

          level.score = level.solutions.score.clone()
          level.solutions.score.show()
          level.solutions.save()
        }
      }
    }
    return {
      career: career,
      careerLevels: careerLevels,
      selectedID: -1
    }
  },

  created() {
    if (!this.career) {
      this.$router.replace({
        name: 'home',
      })
    }
  },

  mounted() {
    this.$music.play('levellist')
    if (this.scoreAnimationsPlaying <= 0) {
      this.revealNewlyUnlockedLevels()
    }
  },

  beforeRouteEnter(to, from, next) {
    let careerID = parseInt(to.params.careerID)
    let career = storage.getCareer(careerID)
    if (!career) {
      next({
        name: 'home',
        replace: true,
      })
    }

    else {
      next(vm => {
        if (vm.$router.levelListScroll && vm.$router.levelListScroll.path !== to.path) {
          vm.$router.levelListScroll = null
        }

        if (vm.$router.levelListScroll) {
          vm.$el.scrollTop = vm.$router.levelListScroll.scrollTop
        }
        else {
          setTimeout(() => vm.scrollToLastUnlockedLevel(), 300)
        }
      })
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$router.levelListScroll = {
      path: from.path,
      scrollTop: this.$el.scrollTop,
    }
    next()
  },

  methods: {
    isPremium() {
      return storage.isPremium
    },

    selectLevel(id, unlocked) {
      if (unlocked) {
        this.selectedID = id
      }
    },

    scrollToLastCategory(callback) {
      if (this.$refs.categories.length > 1) {
        this.scrollToCategory(this.$refs.categories.length - 1, callback)
      }
    },

    scrollToCategory(index, callback) {
      if (index < this.$refs.categories.length) {
        let category = this.$refs.categories[index].$el
        SmoothScrollTo(category, 0.77, 200, 1300, -80, this.$el, callback)
      }
    },

    scrollToLastUnlockedLevel(callback) {
      let lastLevel = null
      for (let category of this.careerLevels) {
        for (let level of category.levels) {
          if (level.unlocked) {
            lastLevel = level
          }
        }
      }

      if (lastLevel) {
        this.scrollToLevel(lastLevel.id)
      }
    },

    scrollToLevel(levelID, callback) {
      let levelItem = this.$refs.levelItems.find(item => item.level.id === levelID)
      if (levelItem) {
        let itemBox = levelItem.$el.getBoundingClientRect()
        if (itemBox.top - 115 < 0 || itemBox.bottom + 115 > window.innerHeight) {
          let offset = -(window.innerHeight - 310) / 2
          SmoothScrollTo(levelItem.$el, 0.4, 100, 1300, offset, this.$el, callback)
          return
        }
      }
      if (typeof callback === 'function') {
        callback()
      }
    },

    handleShowScoreAnimationEnd() {
      this.scoreAnimationsPlaying--

      if (this.scoreAnimationsPlaying <= 0) {
        this.revealNewlyUnlockedLevels()
      }
    },

    revealNewlyUnlockedLevels() {
      for (let category of this.careerLevels) {
        for (let level of category.levels) {
          if (level.newlyUnlocked && !level.revealed) {
            this.revealNewlyUnlockedLevel(level)
            return
          }
        }
      }
    },

    revealNewlyUnlockedLevel(level) {
      this.scrollToLevel(level.id, () => {
        level.revealed = true
        this.$sound.play('level_list_unlock')
        setTimeout(() => this.revealNewlyUnlockedLevels(), 250)
      })
    },

    showPremiumModal() {
      this.$refs.modalLayer.addModal({
        component: PremiumModal,
        key: 'premium_modal',
        props: {},
        handlers: {
          confirm: this.showUnlockPremiumModal
        }
      })
    },

    showUnlockPremiumModal() {
      this.$refs.modalLayer.addModal({
        component: UnlockPremiumModal,
        key: 'unlock_premium_modal',
        props: {},
        handlers: {
          confirm: this.showPremiumActivatedModal
        }
      })
    },

    showPremiumActivatedModal() {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'premium_activated_modal',
        props: {
          type: 'info',
          cancelable: false,
          text: this.$text('premium_activated_modal'),
        },
        handlers: {
          // Reload page to show unlocked levels
          close: () => window.location.reload()
        }
      })
    },
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

    header {
        background-image: url("../images/level-list-banner.png");
        margin-top: 20px;
        width: 100%;
        max-height: 233px;
        height: calc(calc(100vw - 80px) * 0.21);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-table;
    }

    .list-container {
        margin: 80px 0;
        display: flex;
        justify-content: center;
        align-items: stretch;

        &:first-of-type {
            margin-top: 0;
        }

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
                background-color: #654683;
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

    .premium-levels-button-container {
        button {
            display: block;
            background: #568AF2;
            padding: 20px 24px;
            margin: 0 auto 80px;
            font-family: 'Roboto', Arial, sans-serif;
            color: white;
            font-size: 25px;
            line-height: 25px;
            font-weight: 500;
            cursor: pointer;
            outline: none;
            border: none;

            border-radius: 3px;
            box-shadow: inset 0 0 10px 3px #0003, 0 0 10px 0 #0003;
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
