<template>
<li :class="{
	'level-item': true,
	'locked': locked
}">{{
	level.name
}}</li>
</template>

<script>
export default {
  components: {},
  props: {
    'level': {
      type: Object
    },
    'locked': {
      type: Boolean
    }
  },
  computed: {
    url: function() {
      return `level/${this.level.id}`
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';

.level-item {
    @include card-box;
    padding: 49px 60px 30px;
    flex-direction: column;
    font-size: 60px;
    margin-right: 20px;
    display: flex;
    text-align: center;
    font-weight: 500;

    &:not(.locked) {
        @include home-card($default-card-color, true);
    }

    &.locked {
        @include home-card(#3C404A, false, transparentize(white, 0.7));
        cursor: default;
    }
}
</style>
