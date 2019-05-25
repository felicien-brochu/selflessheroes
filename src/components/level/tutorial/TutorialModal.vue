<template>
<div class="tutorial-modal"
  :style="style">

  <div class="tutorial-text">{{text}}</div>
  <button class="next-button mdi mdi-arrow-right-circle"
    :title="$text('tutorial_button_next')"
    @click="$emit('next')" />

  <div class="arrow"
    :style="arrowStyle" />

</div>
</template>

<script>
import {
  TutorialAnchor
}
from './TutorialConfig'

const arrowSize = 14

export default {
  props: {
    text: String,
    anchor: TutorialAnchor
  },

  data: function() {
    return {
      style: {},
      arrowStyle: {}
    }
  },

  mounted() {
    this.updateStyle()
  },

  methods: {
    updateStyle() {
      this.style = this.computeStyle()
      this.arrowStyle = this.computeArrowStyle()
    },

    computeStyle() {
      let {
        x,
        y
      } = this.anchor.getTargetPosition()
      let {
        width,
        height
      } = this.$el.getBoundingClientRect()

      let style = {}

      switch (this.anchor.arrowPosition) {
        case 'top':
          style.top = px(y + arrowSize)
          style.left = px(x)
          style.transform = transformCenterX
          break
        case 'bottom':
          style.top = px(y - height - arrowSize)
          style.left = px(x)
          style.transform = transformCenterX
          break
        case 'left':
          style.top = px(y)
          style.left = px(x + arrowSize)
          style.transform = transformCenterY
          break
        case 'right':
          style.top = px(y)
          style.left = px(x - width - arrowSize)
          style.transform = transformCenterY
          break
      }

      return style
    },

    computeArrowStyle() {
      let style = {}
      switch (this.anchor.arrowPosition) {
        case 'top':
          style.top = px(-arrowSize)
          style.left = '50%'
          style.transform = transformCenterX
          style['border-width'] = "0 15px 15px"
          style['border-color'] = "#568AF2 transparent"
          break
        case 'bottom':
          style.bottom = px(-arrowSize)
          style.left = '50%'
          style.transform = transformCenterX
          style['border-width'] = "15px 15px 0"
          style['border-color'] = "#568AF2 transparent"
          break
        case 'left':
          style.left = px(-arrowSize)
          style.top = '50%'
          style.transform = transformCenterY
          style['border-width'] = "15px 15px 15px 0"
          style['border-color'] = "transparent #568AF2"
          break
        case 'right':
          style.right = px(-arrowSize)
          style.top = '50%'
          style.transform = transformCenterY
          style['border-width'] = "15px 0 15px 15px"
          style['border-color'] = "transparent #568AF2"
          break
        default:
          style.display = 'none'
      }
      return style
    }
  }
}

let px = value => `${value}px`
const transformCenterX = 'translateX(-50%)'
const transformCenterY = 'translateY(-50%)'
const transformCenter = 'translate(-50%, -50%)'
</script>

<style lang="scss">
$text-color: white;
$modal-color: #568AF2;

.tutorial-modal {
    background-color: $modal-color;
    color: $text-color;
    box-sizing: border-box;
    width: max-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 0 100px 10px #00000066;
    padding: 20px 15px 20px 30px;
    max-width: 400px;

    button {
        margin: 0;
        padding: 0;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        color: white;
        font-size: 30px;
    }

    .tutorial-text {
        font-size: 20px;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: auto;
    }

    .next-button {
        margin-left: 10px;
    }

    .arrow {
        position: absolute;
        border-style: solid;
        display: block;
        width: 0;
    }
}
</style>
