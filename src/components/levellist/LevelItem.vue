<template>
<li :class="{
	'level-item': true,
	'locked': locked || (newlyUnlocked && !revealed),
	'bonus': bonus,
}">
  <h3 v-text-fit="{
		alignHoriz: true,
		alignVert: true,
		maxFontSize: 40,
		minFontSize: 30
	}">{{
	$text(level.getNameMessageKey())
	}}</h3>

  <score-stars-animation :score="score"
    :level="level"
    v-show="!locked"
    @show-score-animation-end="$emit('show-score-animation-end')"
    :class="{
			'hidden': newlyUnlocked && !revealed,
		}" />

  <div v-if="bonus"
    :class="{
			'bonus-label': true,
			'hidden': newlyUnlocked && !revealed,
		}"><i class="mdi mdi-star" />&nbsp;{{$text('level_list_bonus_label')}}&nbsp;<i class="mdi mdi-star" /></div>
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
    'newlyUnlocked': {
      type: Boolean,
      default: false,
    },
    'revealed': Boolean,
  }
}
</script>

<style lang="scss">
@import '../mixins';

.level-item {
    @include card-box;
    padding: 49px 0 30px;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    display: flex;

    &:not(.locked) {
        @include home-card($default-card-color, true);
        transition-property: background-color, color, transform;
    }

    &.locked {
        @include home-card(#3C404A, false, transparentize(white, 0.7));
        cursor: default;
    }

    h3 {
        width: 220px;
        height: 40px;
        font-size: 40px;
        text-align: center;
        font-weight: 500;
        margin: 0;
    }

    .score-stars-animation-level {
        margin-top: 47px;
        width: 183px;
        height: 100px;

        transition: opacity 250ms ease;
        &.hidden {
            opacity: 0;
        }
    }

    .bonus-label {
        margin-top: 6px;
        color: #fbb811;
        background-color: #394249;
        font-size: 13px;
        font-weight: bold;
        padding: 8px 12px;
        border-radius: 17px;

        transition: opacity 250ms ease;
        &.hidden {
            opacity: 0;
        }
    }
}
</style>
