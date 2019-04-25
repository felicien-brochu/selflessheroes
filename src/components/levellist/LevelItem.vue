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
.level-item {
    width: 200px;
    height: 100px;
    border-radius: 20px;
    background-color: #488286;
    color: darken(#488286, 25%);
    font-size: 24px;
    text-align: center;
    line-height: 100px;
    font-weight: 500;
    box-shadow: 0 0 10px 5px #13161aaa;
    cursor: pointer;

    &:hover {
        background-color: #488286;
    }
}
</style>
