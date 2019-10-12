<template>
<li class="variable">
  <i class="icon-variable" />
  <div class="variable-name">{{name | shortName}}&nbsp;:</div>
  <div class="variable-value">

    <div v-if="isRawType"
      class="raw-value"
      :style="{fontSize: rawValue.fontSize}">{{rawValue.value}}</div>

    <i v-else-if="isIconType"
      :class="icon" />

    <i v-else-if="isEgg"
      class="egg-value icon-egg"
      :style="{fontSize: eggDigits.fontSize}"> {{
				eggDigits.value
			}}</i>

  </div>
</li>
</template>

<script>
import ExpressionTypes from '../../../world/ai/compile/statements/ExpressionTypes'
import ObjectType from '../../../world/objects/ObjectType'
import TerrainType from '../../../world/map/TerrainType'
import heroColors from '../../../shared/heroColors'


export default {
  props: {
    'variable': {
      type: Object
    },
    'name': {
      type: String
    }
  },

  filters: {
    shortName: function(name) {
      if (!name) {
        return ''
      }
      return name.substring(1)
    }
  },

  computed: {
    isRawType: function() {
      let type = this.variable.getDominantValue().type
      return type === ExpressionTypes.integer || type === ExpressionTypes.boolean
    },
    rawValue: function() {
      let rawValue = ''
      let value = this.variable.getDominantValue()
      if (value.type === ExpressionTypes.integer) {
        value = value.value
        if (value >= 1e3 || value <= -1e3) {
          if (value === Infinity) {
            rawValue = '∞'
          }
          else if (value === -Infinity) {
            rawValue = '-∞'
          }
          else {
            let exponent = Math.floor(Math.log10(Math.abs(value)))
            let base = Math.floor(value / (10 ** exponent))
            rawValue = `${base}^${exponent}`
          }
        }
        else {
          rawValue = value.toString()
        }
      }
      else if (value.type === ExpressionTypes.boolean) {
        rawValue = value.value.toString()
      }

      let fontSize = Math.min(16, 30 / rawValue.length)
      return {
        value: rawValue,
        fontSize: `${fontSize}px`,
      }
    },
    isIconType: function() {
      let value = this.variable.getDominantValue()
      return value.type === ExpressionTypes.terrainType ||
        value.type === ExpressionTypes.objectType ||
        (value.type === ExpressionTypes.object &&
          value.value.type !== ObjectType.egg)
    },
    icon: function() {
      let value = this.variable.getDominantValue()
      let icon = ''
      if (value.type === ExpressionTypes.object) {
        let obj = value.value
        if (obj.type === ObjectType.hero) {
          icon = `hero-${heroColors[obj.color % heroColors.length]}`
        }
        else {
          icon = `icon-${ObjectType.keyOf(obj.type)}`
        }
      }
      else if (value.type === ExpressionTypes.objectType) {
        icon = `icon-${ObjectType.keyOf(value.value)}`
      }
      else if (value.type === ExpressionTypes.terrainType) {
        icon = `icon-${TerrainType.keyOf(value.value)}`
      }

      return icon
    },
    isEgg: function() {
      let value = this.variable.getDominantValue()
      return value.type === ExpressionTypes.object &&
        value.value.type === ObjectType.egg
    },
    eggDigits: function() {
      let egg = this.variable.getDominantValue().value
      let value = egg.value
      let text = ''
      if (value >= 1e3 || value <= -1e2) {
        if (value >= 1e10) {
          text = '∞'
        }
        else if (value <= -1e2) {
          text = '-∞'
        }
        else {
          let exponent = Math.floor(Math.log10(Math.abs(value)))
          let base = Math.floor(value / (10 ** exponent))
          text = `${base}^${exponent}`
        }
      }
      else {
        text = value.toString()
      }

      let fontSize = Math.min(9, 18 / text.length)
      return {
        value: text,
        fontSize: `${fontSize}px`,
      }
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';

.variable {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #282c34;
    background-color: #87A7C1;
    border-radius: 7px;
    padding-left: 5px;

    i {
        width: 22px;
        height: 22px;
        display: inline-block;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .variable-name {
        font-weight: 500;
        font-size: 20px;
        margin-left: 3px;
    }

    .variable-value {
        font-weight: 500;
        width: 38px;
        height: 34px;
        line-height: 37px;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
            width: 26px;
            height: 26px;
        }

        .raw-value {
            font-family: Digits, Roboto, sans-serif;
            font-size: 16px;
            text-align: center;
        }

        .egg-value {
            text-align: center;
            line-height: 35px;
            font-style: normal;
            font-family: Digits, monospace;
            color: #302d24;
            font-size: 9px;
            box-sizing: border-box;
            width: 32px;
            height: 32px;
        }
    }
}

.hero-blue {
    background-image: url("../../images/hero-blue.png");
}
.hero-dark-blue {
    background-image: url("../../images/hero-dark-blue.png");
}
.hero-fuchsia {
    background-image: url("../../images/hero-fuchsia.png");
}
.hero-green {
    background-image: url("../../images/hero-green.png");
}
.hero-hollywood-green {
    background-image: url("../../images/hero-hollywood-green.png");
}
.hero-orange {
    background-image: url("../../images/hero-orange.png");
}
.hero-pink {
    background-image: url("../../images/hero-pink.png");
}
.hero-purple {
    background-image: url("../../images/hero-purple.png");
}
.hero-red {
    background-image: url("../../images/hero-red.png");
}
.hero-turquoise {
    background-image: url("../../images/hero-turquoise.png");
}
.hero-yellow {
    background-image: url("../../images/hero-yellow.png");
}
</style>
