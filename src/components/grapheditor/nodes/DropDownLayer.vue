<template>
<div :class="{
	'drop-down-layer': true,
	'active': active
}">
</div>
</template>

<script>
import Vue from 'vue'
import DropDownList from './DropDownList'

export default {
  props: {
    compilerConfig: {
      type: Object
    }
  },
  data: function() {
    return {
      'dropDownList': null
    }
  },
  computed: {
    active: function() {
      return !!this.dropDownList
    }
  },

  mounted() {
    this.dropDownList = null

    this.graphCode = this.$parent.$refs.graphCode
    this.graphCode.$on('scroll', this.updateDropDownPosition)

    window.addEventListener('resize', this.updateDropDownPosition)
    window.addEventListener('mousedown', this.handleWindowClick)
  },

  beforeDestroy() {
    this.graphCode.$off('scroll', this.updateDropDownPosition)
    window.removeEventListener('resize', this.updateDropDownPosition)
    window.removeEventListener('mousedown', this.handleWindowClick)
  },

  methods: {
    createDropDownList({
      anchor,
      types,
      value
    }) {
      this.closeDropDownList()

      this.dropDownList = new(Vue.extend(DropDownList))({
        propsData: {
          types: types,
          value: value,
          anchor: anchor,
          frame: this.graphCode.$el,
          compilerConfig: this.compilerConfig
        }
      })

      this.dropDownList.$parent = this
      this.dropDownList.$mount()
      this.dropDownList.$on('select-value', this.closeDropDownList)

      this.$el.appendChild(this.dropDownList.$el)
      this.updateDropDownPosition()
      return this.dropDownList
    },

    handleWindowClick(e) {
      if (this.active) {
        let isDropDownButton = false
        let isTarget = false
        let node = e.target
        while (node !== document) {
          if (node === this.dropDownList.$el) {
            isTarget = true
            break
          }
          if (node.classList.contains('drop-down-button')) {
            isDropDownButton = true
            break
          }
          node = node.parentNode
        }

        if (!isTarget && !isDropDownButton) {
          this.closeDropDownList()
        }
      }
    },

    updateDropDownPosition() {
      if (this.dropDownList) {
        this.dropDownList.updatePosition()
      }
    },

    closeDropDownList() {
      if (this.dropDownList) {
        this.dropDownList.close()
        this.dropDownList.$destroy()
        this.$el.removeChild(this.dropDownList.$el)
        this.dropDownList = null
      }
    }
  }
}
</script>

<style lang="scss">
.drop-down-layer {
    display: none;
    position: fixed;

    &.active {
        display: block;
    }
}
</style>
