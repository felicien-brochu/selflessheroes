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
      let targetPosition
      try {
        targetPosition = this.anchor.getTargetPosition()
      }
      catch (e) {
        this.$emit('next')
        return
      }
      let {
        x,
        y
      } = targetPosition
      let {
        width,
        height
      } = this.$el.getBoundingClientRect()

      let style = {}

      let {
        position,
        origin,
        offset
      } = this.anchor.arrowPosition

      switch (position) {
        case 'top':
          style.top = px(y + arrowSize)
          style.left = px(x)
          switch (origin) {
            case 'center':
              style.transform = offsetCenterX(-offset)
              break
            case 'start':
              style.transform = offsetStartX(-offset)
              break
            case 'end':
              style.transform = offsetEndX(-offset, width)
              break
          }
          break
        case 'bottom':
          style.top = px(y - height - arrowSize)
          style.left = px(x)
          switch (origin) {
            case 'center':
              style.transform = offsetCenterX(-offset)
              break
            case 'start':
              style.transform = offsetStartX(-offset)
              break
            case 'end':
              style.transform = offsetEndX(-offset, width)
              break
          }
          break
        case 'left':
          style.top = px(y)
          style.left = px(x + arrowSize)
          switch (origin) {
            case 'center':
              style.transform = offsetCenterY(-offset)
              break
            case 'start':
              style.transform = offsetStartY(-offset)
              break
            case 'end':
              style.transform = offsetEndY(-offset, height)
              break
          }
          break
        case 'right':
          style.top = px(y)
          style.left = px(x - width - arrowSize)
          switch (origin) {
            case 'center':
              style.transform = offsetCenterY(-offset)
              break
            case 'start':
              style.transform = offsetStartY(-offset)
              break
            case 'end':
              style.transform = offsetEndY(-offset, height)
              break
          }
          break
      }

      return style
    },

    computeArrowStyle() {
      let {
        width,
        height
      } = this.$el.getBoundingClientRect()

      let {
        position,
        origin,
        offset
      } = this.anchor.arrowPosition

      let style = {}

      switch (position) {
        case 'top':
          style['border-width'] = "0 15px 15px"
          style['border-color'] = "#568AF2 transparent"
          style.top = px(-arrowSize)

          switch (origin) {
            case 'center':
              style.left = '50%'
              style.transform = offsetCenterX(offset)
              break
            case 'start':
              style.left = '0'
              style.transform = offsetCenterX(offset)
              break
            case 'end':
              style.left = '0'
              style.transform = offsetCenterX(width + offset)
              break
          }
          break
        case 'bottom':
          style['border-width'] = "15px 15px 0"
          style['border-color'] = "#568AF2 transparent"
          style.bottom = px(-arrowSize)

          switch (origin) {
            case 'center':
              style.left = '50%'
              style.transform = offsetCenterX(offset)
              break
            case 'start':
              style.left = '0'
              style.transform = offsetCenterX(offset)
              break
            case 'end':
              style.left = '0'
              style.transform = offsetCenterX(width + offset)
              break
          }
          break
        case 'left':
          style['border-width'] = "15px 15px 15px 0"
          style['border-color'] = "transparent #568AF2"
          style.left = px(-arrowSize)

          switch (origin) {
            case 'center':
              style.top = '50%'
              style.transform = offsetCenterY(offset)
              break
            case 'start':
              style.top = '0'
              style.transform = offsetCenterY(offset)
              break
            case 'end':
              style.top = '0'
              style.transform = offsetCenterY(height + offset)
              break
          }
          break
        case 'right':
          style['border-width'] = "15px 0 15px 15px"
          style['border-color'] = "transparent #568AF2"
          style.right = px(-arrowSize)

          switch (origin) {
            case 'center':
              style.top = '50%'
              style.transform = offsetCenterY(offset)
              break
            case 'start':
              style.top = '0'
              style.transform = offsetCenterY(offset)
              break
            case 'end':
              style.top = '0'
              style.transform = offsetCenterY(height + offset)
              break
          }
          break
        default:
          style.display = 'none'
      }
      return style
    }
  }
}

let px = value => `${value}px`
const offsetCenterX = value => `translateX(calc(-50% + ${value}px))`
const offsetCenterY = value => `translateY(calc(-50% + ${value}px))`
const offsetStartX = value => `translateX(${value}px)`
const offsetStartY = value => `translateY(${value}px)`
const offsetEndX = (value, width) => `translateX(${value - width}px)`
const offsetEndY = (value, height) => `translateY(${value - height}px)`
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
    box-shadow: 0 0 100px 10px rgba(0,0,0,0.4);
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
