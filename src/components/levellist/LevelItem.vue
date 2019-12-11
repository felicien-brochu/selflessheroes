<template>
<li :class="{
	'level-item': true,
	'locked': locked || (newlyUnlocked && !revealed),
	'bonus': bonus,
	'boss': boss,
}">

  <div v-if="bossName"
    class="boss-title">
    <div :class="[
				'boss-icon',
				`boss-icon-${bossName}`,
			]" />
  </div>

  <h3 v-else
    v-text-fit="{
			alignHoriz: true,
			alignVert: false,
			maxFontSize: 50,
			minFontSize: 39
		}">{{$text(level.getNameMessageKey())}}</h3>



  <score-stars-animation :score="score"
    :level="level"
    v-if="!locked"
    @show-score-animation-end="$emit('show-score-animation-end')"
    :class="{
			'hidden': newlyUnlocked && !revealed,
		}" />

  <div v-if="hasBonusLabel"
    :class="{
			'bonus-label': true,
			'hidden': newlyUnlocked && !revealed,
		}"><i class="mdi mdi-star" />&nbsp;{{$text('level_list_bonus_label')}}&nbsp;<i class="mdi mdi-star" /></div>
  <div v-if="hasBossLabel"
    :class="{
			'boss-label': true,
			'hidden': newlyUnlocked && !revealed,
		}"><i class="mdi mdi-skull-crossbones" />&nbsp;{{$text('level_list_boss_label')}}&nbsp;<i class="mdi mdi-skull-crossbones" /></div>
</li>
</template>

<script>
import ScoreStarsAnimation from './ScoreStarsAnimation'

export default {
  components: {
    ScoreStarsAnimation,
  },

  props: {
    'level': Object,
    'score': Object,
    'locked': Boolean,
    'bonus': Boolean,
    'boss': Boolean,
    'bossName': String,
    'newlyUnlocked': {
      type: Boolean,
      default: false,
    },
    'revealed': Boolean,
  },

  computed: {
    hasBonusLabel: function() {
      return this.bonus && !this.boss
    },

    hasBossLabel: function() {
      return this.boss && !this.locked
    },
  },
}
</script>

<style lang="scss">
@import '../mixins';

.level-item {
    @include card-box;
    padding: 29px 0 30px;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    display: flex;
    position: relative;

    h3 {
        height: 60px;
    }

    &:not(.locked) {
        @include home-card(#325068, true, #a0bfdb);
        transition-property: background-color, color, transform;
        h3 {
            text-shadow: 0 0 10px #2f3e4b;
        }

        &.boss {
            @include home-card(#344553, true);
        }
    }

    &.locked {
        @include home-card(#3C404A, false, transparentize(white, 0.8));
        cursor: default;

        .boss-title {

            .boss-icon {
                opacity: 0.3;
                width: 180px;
                height: 180px;
                top: 50%;
                right: 50%;
                transform: translate(50%, -50%);
            }
        }
    }

    .boss-title {
        height: 60px;

        .boss-icon {
            width: 160px;
            height: 160px;
            position: absolute;
            top: 15px;
            right: 50%;
            background-size: contain;
            background-repeat: no-repeat;
            transform: translateX(50%);
        }
    }

    .score-stars-animation-level {
        margin-top: 53px;
        width: 183px;
        height: 100px;

        transition: opacity 250ms ease;
        &.hidden {
            opacity: 0;
        }
    }

    .bonus-label,
    .boss-label {
        margin-top: 6px;
        font-size: 13px;
        color: #fbb811;
        font-weight: bold;
        padding: 8px 12px;
        border-radius: 17px;

        transition: opacity 250ms ease;
        &.hidden {
            opacity: 0;
        }
    }

    .bonus-label {
        background-color: #2f3b46;
    }

    .boss-label {
        background-color: #2b353e;
    }
}
</style>
