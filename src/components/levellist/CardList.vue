<template>
<ul class="card-list"
  :style="{
		width: containerWidth + 'px',
	}">
  <slot></slot>
  <li v-for="n in ghosts"
    class="card-ghost"
    :style="{
			width: itemWidth + 'px',
			marginLeft: horizontalMargin + 'px',
			marginRight: horizontalMargin + 'px',
		}"></li>
</ul>
</template>

<script>
export default {
  components: {},
  props: {
    "itemWidth": {
      type: Number,
      default: 0,
    },
    "horizontalMargin": {
      type: Number,
      default: 0,
    },
    "leftOffset": {
      type: Number,
      default: 0,
    }
  },

  data: function() {
    return {
      itemByRow: 0,
    }
  },

  created() {
    this.resizeObserver = new ResizeObserver(this.onResize)
  },

  mounted() {
    this.paddingLeft = window.getComputedStyle(this.$el).getPropertyValue("padding-left")
    this.paddingLeft = parseInt(this.paddingLeft)
    this.paddingRight = window.getComputedStyle(this.$el).getPropertyValue("padding-right")
    this.paddingRight = parseInt(this.paddingRight)

    this.resizeObserver.observe(this.$el.parentNode)
  },

  beforeDestroy() {
    this.resizeObserver.unobserve(this.$el.parentNode)
  },

  computed: {
    ghosts: function() {
      if (this.itemByRow <= 0) {
        return 0
      }

      let ghosts = this.itemByRow - (this.$slots.default.length % this.itemByRow)
      if (ghosts === this.itemByRow) {
        ghosts = 0
      }
      return ghosts
    },

    containerWidth: function() {
      return this.itemByRow * (this.itemWidth + 2 * this.horizontalMargin)
    },
  },

  methods: {
    onResize() {
      let availableWidth = this.$el.parentNode.clientWidth - this.paddingLeft - this.paddingRight - this.leftOffset
      this.itemByRow = Math.floor(availableWidth / (this.itemWidth + 2 * this.horizontalMargin))
    }
  },
}
</script>

<style lang="scss">
</style>
