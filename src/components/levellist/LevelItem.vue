<template>
<li :class="{
	'level-item': true,
	'locked': locked
}">
  <h3>{{
	level.name
	}}</h3>

  <score-stars :score="score"
    :level="level"
    v-show="!locked && score && score.won" />
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
    'score': Object
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
        font-size: 60px;
        text-align: center;
        font-weight: 500;
        margin: 0;
    }

    .score-stars {
        margin-top: 40px;
        width: 155px;
        height: 84px;
    }
}
</style>
