<template>
<li :class="{
	'level-item': true,
	'locked': locked,
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

  <score-stars :score="score"
    :level="level"
    v-show="!locked" />

  <div v-if="bonus"
    class="bonus-label"><i class="mdi mdi-star" />&nbsp;{{$text('level_list_bonus_label')}}&nbsp;<i class="mdi mdi-star" /></div>
</li>
</template>

<script>
import ScoreStars from './ScoreStars'

export default {
  components: {
    ScoreStars
  },

  props: {
    'level': Object,
    'locked': Boolean,
    'bonus': Boolean,
    'score': Object,
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

    .score-stars {
        margin-top: 55px;
        width: 155px;
        height: 84px;
    }

    .bonus-label {
        margin-top: 14px;
        color: #fbb811;
        background-color: #394249;
        font-size: 13px;
        font-weight: bold;
        padding: 8px 12px;
        border-radius: 17px;
    }
}
</style>
