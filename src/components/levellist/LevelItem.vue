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
.level-item {}
</style>
