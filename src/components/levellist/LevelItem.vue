<template>
<router-link class="level-item"
  tag="li"
  :to="url">{{
		level.name
	}}</router-link>
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
.home {}
</style>
