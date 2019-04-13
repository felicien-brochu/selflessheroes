<template>
<div :class="{
	'popup-layer': true,
	'active': active
}">
</div>
</template>

<script>
import Vue from 'vue'
import DropDownList from './DropDownList'
import DirectionPopup from './DirectionPopup'
import IntegerPopup from './IntegerPopup'

const verticalPadding = 10
const horizontalPadding = 8

export default {
  props: {
    compilerConfig: {
      type: Object
    }
  },
  data: function() {
    return {
      'popup': null
    }
  },
  computed: {
    active: function() {
      return !!this.popup
    }
  },

  mounted() {
    this.previousPopup = null

    this.graphCode = this.$parent.$refs.graphCode
    this.graphCode.$on('scroll', this.updatePopupPosition)

    window.addEventListener('resize', this.updatePopupPosition)
    window.addEventListener('mousedown', this.handleWindowClick)
    window.addEventListener('touchstart', this.handleWindowClick)
  },

  beforeDestroy() {
    this.graphCode.$off('scroll', this.updatePopupPosition)
    window.removeEventListener('resize', this.updatePopupPosition)
    window.removeEventListener('mousedown', this.handleWindowClick)
    window.removeEventListener('touchstart', this.handleWindowClick)
  },

  methods: {
    createDropDownList({
      anchor,
      types,
      value
    }) {
      this.closePopup()

      this.popup = new(Vue.extend(DropDownList))({
        propsData: {
          types: types,
          value: value,
          anchor: anchor,
          frame: this.graphCode.$el,
          compilerConfig: this.compilerConfig
        }
      })

      this.attachPopup()

      return this.popup
    },

    createDirectionPopup({
      anchor,
      directions,
      multiple
    }) {
      this.closePopup()

      this.popup = new(Vue.extend(DirectionPopup))({
        propsData: {
          directions: directions,
          multiple: multiple,
          anchor: anchor,
          frame: this.graphCode.$el
        }
      })
      this.attachPopup()

      return this.popup
    },

    createIntegerPopup({
      anchor,
      integer
    }) {
      this.closePopup()

      this.popup = new(Vue.extend(IntegerPopup))({
        propsData: {
          value: integer,
          anchor: anchor,
          frame: this.graphCode.$el
        }
      })
      this.attachPopup()

      return this.popup
    },

    attachPopup() {
      this.popup.$parent = this
      this.popup.$mount()
      this.popup.$on('select-value', this.closePopup)

      this.$el.appendChild(this.popup.$el)
      this.$nextTick(this.updatePopupPosition)
    },

    handleWindowClick(e) {
      if (this.active) {
        let isDropDownButton = false
        let isTarget = false
        let node = e.target
        while (node !== document) {
          if (node === this.popup.$el || (this.previousPopup && node === this.previousPopup.$el)) {
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
          this.closePopup()
        }
      }
    },

    updatePopupPosition() {
      if (this.popup) {
        this.popup.updatePosition(horizontalPadding, verticalPadding)
      }
    },

    closePopup() {
      if (this.popup) {
        this.previousPopup = this.popup
        let popup = this.popup
        this.popup = null
        popup.close()
        popup.$destroy()
        this.$el.removeChild(popup.$el)
      }
    }

  }
}
</script>

<style lang="scss">
.popup-layer {
    display: none;
    position: fixed;

    &.active {
        display: block;
    }
}
</style>
