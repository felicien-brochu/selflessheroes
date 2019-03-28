<template>
  <span @mouseover="isMouseOver = true" @mouseout="isMouseOver = false" class="Resizer" :style="resStyle"> </span>    
</template>

<script>
export default {
  name: 'resizer-comp',
  props: [
    'splitTo',
    'resizerColor',
    'resizerBorderColor',
    'resizerThickness',
    'resizerBorderThickness',
  ],
  data() {
    return {
      isMouseOver: false,
    }
  },
  methods: {
    evMouseOver() {
      this.isMouseOver = true
    },
  },
  computed: {
    resizerTotalThickness() {
      return this.resizerThickness + this.resizerBorderThickness * 2
    },
    margin() {
      return Math.floor(this.resizerThickness / 2) + this.resizerBorderThickness
    },
    rBorder() {
      if (this.splitTo === 'rows') {
        return { border1: 'top', border2: 'bottom' }
      } else {
        return { border1: 'left', border2: 'right' }
      }
    },
    resStyle: function() {
      let tmpStyle = {}

      tmpStyle['background-color'] = this.resizerColor

      if (this.splitTo === 'rows') {
        tmpStyle.height = this.resizerTotalThickness + 'px'
        tmpStyle.margin = '-' + this.margin + 'px 0'
        tmpStyle.padding = '0 ' + this.resizerBorderThickness + 'px'
      } else {
        tmpStyle.width = this.resizerTotalThickness + 'px'
        tmpStyle.margin = '0 ' + '-' + this.margin + 'px'
        tmpStyle.padding = this.resizerBorderThickness + 'px 0'
      }

      if (this.isMouseOver) {
        tmpStyle[`border-${this.rBorder.border1}`] = tmpStyle[
          `border-${this.rBorder.border2}`
        ] =
          this.resizerBorderColor +
          ' solid ' +
          this.resizerBorderThickness +
          'px'
      } else {
        tmpStyle[`border-${this.rBorder.border1}`] = tmpStyle[
          `border-${this.rBorder.border2}`
        ] =
          'transparent solid ' + this.resizerBorderThickness + 'px'
      }

      return tmpStyle
    },
  },
}
</script>

<style scoped>
.Resizer {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 10000;
  -moz-background-clip: padding-box;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
}

.Resizer:hover {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.Resizer.rowsres {
  cursor: row-resize;
  width: 100%;
}

.Resizer.columnsres {
  height: 100%;
  cursor: col-resize;
}
</style>
