<template>
<li class="variable">
  <i class="icon-variable" />
  <div class="variable-name">{{name | shortName}}&nbsp;:</div>
  <div class="variable-value">

    <div v-if="isRawType"
      :class="{
				'raw-value': true,
				'small': variable.getDominantValue().value.toString().length >= 3
			}">{{variable.getDominantValue().value.toString()}}</div>

    <i v-else-if="isIconType"
      :class="icon" />

    <i v-else-if="isEgg"
      class="egg-value icon-egg"> {{
				eggDigits
			}}</i>

  </div>
</li>
</template>

<script>
import ExpressionTypes from '../../../world/ai/compile/statements/ExpressionTypes'
import ObjectType from '../../../world/objects/ObjectType'
import TerrainType from '../../../world/map/TerrainType'

const heroColors = [
  'orange',
  'pink',
  'green',
  'blue',
  'purple',
  'red',
  'turquoise',
  'yellow',
  'dark_blue',
  'fuchsia',
  'hollywood_green',
]

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
        else if (obj.type === ObjectType.switch ||
          obj.type === ObjectType.bonfire ||
          obj.type === ObjectType.cauldron) {
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
      let text = egg.value.toString()
      let length = text.length > 2 ? 2 : text.length
      text = text.substring(text.length - length)
      return text
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

            &.small {
                font-size: 11px;
            }
        }

        .egg-value {
            text-align: center;
            line-height: 35px;
            font-style: normal;
            font-family: Digits, monospace;
            color: #302d24;
            font-size: 9px;
            padding-left: 2px;
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
