<template>
<li class="level-item">{{
	level.name
}}</li>
</template>

<script>
export default {
  components: {},
  props: {
    'level': {
      type: Object
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
@import '../main';

.level-item {
    @include home-card;
    padding: 49px 60px 30px;
    width: 160px;
    height: 230px;
    flex-direction: column;
    font-size: 60px;
    margin-right: 20px;
    display: flex;
    text-align: center;
    font-weight: 500;
}
</style>
