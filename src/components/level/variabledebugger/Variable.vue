<template>
<li class="variable">
  <div class="variable-name">{{name}}&nbsp;:</div>
  <div class="variable-value">

    <div v-if="isRawType"
      class="raw-value">{{variable.value.toString()}}</div>

    <div v-else
      class="composite-value">{{dominantLabel}}</div>

  </div>
</li>
</template>

<script>
import ExpressionTypes from '../../../world/ai/compile/statements/ExpressionTypes'

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
      return this.variable.type === ExpressionTypes.integer || this.variable.type === ExpressionTypes.boolean
    },
    dominantLabel: function() {
      let label = this.variable.getDominantValue().toString().substring(6)
      return label
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

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
        color: #282c34;
        background-color: $branching-color;

        .raw-value {
            font-size: 26px;
            text-align: center;
        }
    }
}
</style>
