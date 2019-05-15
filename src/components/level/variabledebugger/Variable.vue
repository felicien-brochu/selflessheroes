<template>
<li class="variable">
  <div class="variable-name">{{name}}&nbsp;:</div>
  <div class="variable-value">

    <div v-if="isRawType"
      class="raw-value">{{variable.getDominantValue().value.toString()}}</div>

    <i v-else
      :class="icon" />

  </div>
</li>
</template>

<script>
import ExpressionTypes from '../../../world/ai/compile/statements/ExpressionTypes'
import ObjectType from '../../../world/ObjectType'
import TerrainType from '../../../world/TerrainType'

export default {
  props: {
    'variable': {
      type: Object
    },
    'name': {
      type: String
    }
  },

  computed: {
    isRawType: function() {
      return this.variable.getDominantValue().type === ExpressionTypes.integer || this.variable.getDominantValue().type === ExpressionTypes.boolean
    },
    icon: function() {
      let value = this.variable.getDominantValue()
      let icon = ''
      if (value.type === ExpressionTypes.objectType) {
        icon = ObjectType.keyOf(value.value)
      }
      else if (value.type === ExpressionTypes.terrainType) {
        icon = TerrainType.keyOf(value.value)
      }

      return `icon-${icon}`
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

    .variable-name {
        font-weight: 500;
        font-size: 26px;
        margin-right: 7px;
    }

    .variable-value {
        font-weight: 500;
        width: 45px;
        height: 37px;
        line-height: 37px;
        border-radius: 7px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #282c34;
        background-color: $branching-color;

        .raw-value {
            font-size: 26px;
            text-align: center;
        }

        i {
            width: 26px;
            height: 26px;
            display: inline-block;
            background-size: cover;
            background-repeat: no-repeat;
        }
    }
}
</style>
