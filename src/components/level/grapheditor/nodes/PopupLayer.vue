<template>
<div :class="{
	'popup-layer': true,
	'active': active
}">

  <transition name="pop"
    appear>
    <component ref="popup"
      :is="popupComponent"
      :key="popupID"
      v-bind="popupProps"
      @select-value="handleSelectValue"
      :horizontalPadding="horizontalPadding"
      :verticalPadding="verticalPadding" />
  </transition>
</div>
</template>

<script>
import Vue from 'vue'
import _throttle from 'lodash.throttle'
import DropDownList from './DropDownList'
import DirectionPopup from './DirectionPopup'
import IntegerPopup from './IntegerPopup'

const verticalPadding = 10
const horizontalPadding = 8
let popupID = 0

export default {
  props: {
    compilerConfig: {
      type: Object
    }
  },
  data: function() {
    return {
      popupComponent: null,
      popupProps: {},
      horizontalPadding: horizontalPadding,
      verticalPadding: verticalPadding,
      popupID: 0
    }
  },
  computed: {
    active: function() {
      return !!this.popupComponent
    }
  },

  created() {
    this.updatePopupPosition = _throttle(this.updatePopupPosition, 10, {
      leading: true,
      trailing: true
    })
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

    this.updatePopupPosition.cancel()
  },

  methods: {
    getPopup() {
      return this.$refs.popup
    },

    createDropDownList({
      listener,
      anchor,
      types,
      value,
      parentType
    }) {
      this.closePopup()
      this.popupID++

      this.popupProps = {
        types: types,
        value: value,
        anchor: anchor,
        frame: this.graphCode.$el,
        compilerConfig: this.compilerConfig,
        parentType: parentType
      }
      this.popupComponent = DropDownList
      this.selectValueListener = listener
    },



    createDirectionPopup({
      listener,
      anchor,
      directions,
      multiple,
      validator,
      parentType
    }) {
      this.closePopup()
      this.popupID++

      this.popupProps = {
        directions: directions,
        multiple: multiple,
        validator: validator,
        anchor: anchor,
        frame: this.graphCode.$el,
        parentType: parentType
      }
      this.popupComponent = DirectionPopup
      this.selectValueListener = listener
    },

    createIntegerPopup({
      listener,
      anchor,
      integer,
      parentType
    }) {
      this.popupID++

      this.popupProps = {
        value: integer,
        anchor: anchor,
        frame: this.graphCode.$el,
        parentType: parentType
      }
      this.popupComponent = IntegerPopup
      this.selectValueListener = listener
    },

    handleWindowClick(e) {
      if (this.active) {
        let isValueSelect = false
        let isTarget = false
        let node = e.target
        while (node !== document) {
          if ((this.$refs.popup && node === this.$refs.popup.$el) || (this.previousPopup && node === this.previousPopup.$el)) {
            isTarget = true
            break
          }
          if (node.classList.contains('value-select')) {
            isValueSelect = true
            break
          }
          node = node.parentNode
        }

        if (!isTarget && !isValueSelect) {
          this.closePopup()
        }
      }
    },

    updatePopupPosition() {
      if (this.$refs.popup) {
        this.$refs.popup.updatePosition()
      }
    },

    closePopup() {
      if (this.$refs.popup) {
        this.$refs.popup.close()
        this.previousPopup = this.$refs.popup
        this.popupComponent = null
      }
    },

    handleSelectValue(value) {
      this.closePopup()
      this.selectValueListener(value)
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

    .pop-enter-active {
        transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .pop-leave-active {
        transition: transform 0.15s cubic-bezier(0.6, -0.28, 0.735, 0.045);
    }

    .pop-enter,
    .pop-leave-to {
        transform: scale(0);
    }
}
</style>
