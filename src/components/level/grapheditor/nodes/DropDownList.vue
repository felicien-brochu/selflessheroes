<template>
<ul :class="['popup', 'drop-down-list', colorClass]">
  <drop-down-item v-for="(item, index) in items"
    :key="index"
    :class="{
			'comparison-operator': !!item.comparisonOperator,
			'boolean-operator': !!item.booleanOperator,
			'arithmetic-operator': !!item.arithmeticOperator
		}"
    :value="item.value"
    :label="item.label"
    :icon="item.icon"
    :selected="item.selected"
    @select-value="handleItemSelectValue" />
</ul>
</template>

<script>
import Vue from 'vue'
import Popup from './Popup'
import DropDownItem from './DropDownItem'
import {
  comparisonOperators,
  booleanOperators,
  arithmeticOperators
}
from './operators'

import VariableIdentifier from '../../../../world/ai/compile/statements/VariableIdentifier'
import ObjectTypeLiteral from '../../../../world/ai/compile/statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from '../../../../world/ai/compile/statements/literals/TerrainTypeLiteral'
import DirectionLiteral from '../../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../../world/ai/compile/statements/literals/IntegerLiteral'
import ArithmeticOperatorLiteral from '../../../../world/ai/compile/statements/literals/ArithmeticOperatorLiteral'
import ObjectType from '../../../../world/ObjectType'
import TerrainType from '../../../../world/TerrainType'
import {
  compOperators
}
from '../../../../world/ai/compile/statements/SimpleBooleanExpression'
import {
  boolOperators
}
from '../../../../world/ai/compile/statements/BooleanExpression'
import {
  arithmeticOperators as arithOperators
}
from '../../../../world/ai/compile/statements/literals/ArithmeticOperatorLiteral'

export default {
  extends: Popup,
  components: {
    DropDownItem
  },
  props: {
    'value': {
      type: [Object, String, Array]
    },
    'types': {
      type: Array
    },
    'compilerConfig': {
      type: Object
    }
  },
  data: function() {
    return {
      centeredX: true,
      centeredY: false,
      offsetX: 0,
      offsetY: 0
    }
  },

  computed: {
    items: function() {
      let items = []
      for (let type of this.types) {
        if (type === DirectionLiteral) {
          items.push(this.createDirectionItem())
        }
        else if (type === IntegerLiteral) {
          items.push(this.createIntegerLiteralItem())
        }
        else if (type === VariableIdentifier) {
          items = items.concat(this.createVariableItems())
        }
        else if (type === ObjectTypeLiteral) {
          items = items.concat(this.createObjectTypeItems())
        }
        else if (type === TerrainTypeLiteral) {
          items = items.concat(this.createTerrainTypeItems())
        }
        else if (type === 'comparisonOperator') {
          items = items.concat(this.createComparisonOperatorItems())
        }
        else if (type === 'booleanOperator') {
          items = items.concat(this.createBooleanOperatorItems())
        }
        else if (type === 'newBooleanOperator') {
          items = items.concat(this.createNewBooleanOperatorItems())
        }
        else if (type === ArithmeticOperatorLiteral) {
          items = items.concat(this.createArithmeticOperatorItems())
        }
      }
      return items
    }
  },

  mounted() {
    this.cancelled = false
    this.valueSelected = false
  },

  methods: {
    close() {
      if (!this.valueSelected) {
        this.cancel()
      }
    },

    cancel() {
      if (!this.cancelled) {
        this.cancelled = true
        this.$emit('cancel', this.value)
      }
    },

    handleItemSelectValue(value) {
      this.valueSelected = true
      this.$emit('select-value', value)
    },

    createDirectionItem() {
      return {
        label: this.$text('drop_down_list_direction'),
        icon: 'direction',
        value: DirectionLiteral,
        selected: this.value instanceof DirectionLiteral
      }
    },

    createIntegerLiteralItem() {
      return {
        label: this.$text('drop_down_list_number'),
        icon: 'number',
        value: IntegerLiteral,
        selected: this.value instanceof IntegerLiteral
      }
    },

    createVariableItems() {
      let items = []
      for (let identifier of this.compilerConfig.getAllowedVariableIdentifiers()) {
        let variable = new VariableIdentifier(null)
        variable.name = identifier
        items.push({
          label: variable.name,
          icon: 'variable',
          value: variable,
          selected: this.value instanceof VariableIdentifier && this.value.name === variable.name
        })
      }
      return items
    },

    createObjectTypeItems() {
      let items = []
      for (let objectType of this.compilerConfig.objectTypes) {
        let literal = new ObjectTypeLiteral(null)
        literal.name = objectType
        literal.value = ObjectType[objectType]
        items.push({
          label: this.$text(`drop_down_list_object_type_${literal.name}`),
          icon: literal.name,
          value: literal,
          selected: this.value instanceof ObjectTypeLiteral && this.value.value === literal.value
        })
      }
      return items
    },

    createTerrainTypeItems() {
      let items = []
      for (let terrainType of this.compilerConfig.terrainTypes) {
        let literal = new TerrainTypeLiteral(null)
        literal.name = terrainType
        literal.value = TerrainType[terrainType]
        items.push({
          label: this.$text(`drop_down_list_terrain_type_${literal.name}`),
          icon: literal.name,
          value: literal,
          selected: this.value instanceof TerrainTypeLiteral && this.value.value === literal.value
        })
      }
      return items
    },

    createComparisonOperatorItems() {
      let items = []

      for (let operator of compOperators) {
        let item = {
          label: comparisonOperators[operator],
          value: operator,
          selected: this.value === operator,
          comparisonOperator: true
        }

        if (!item.selected || items.length === 0) {
          items.push(item)
        }
        else {
          items.splice(0, 0, item)
        }
      }
      return items
    },

    createBooleanOperatorItems() {
      let items = this.createNewBooleanOperatorItems()
      items.push({
        label: 'delete',
        value: 'delete',
        selected: false
      })
      return items
    },

    createNewBooleanOperatorItems() {
      let items = []

      for (let operator of boolOperators) {
        let item = {
          label: booleanOperators[operator],
          value: operator,
          selected: this.value === operator,
          booleanOperator: true
        }

        if (!item.selected || items.length === 0) {
          items.push(item)
        }
        else {
          items.splice(0, 0, item)
        }
      }
      return items
    },

    createArithmeticOperatorItems() {
      let items = []

      for (let operator of arithOperators) {
        let literal = new ArithmeticOperatorLiteral(null)
        literal.operator = operator
        let item = {
          label: arithmeticOperators[operator],
          value: literal,
          selected: this.value && this.value.operator === operator,
          arithmeticOperator: true
        }

        if (!item.selected || items.length === 0) {
          items.push(item)
        }
        else {
          items.splice(0, 0, item)
        }
      }
      return items
    }

  }

}
</script>

<style lang="scss">
@import '../../mixins';

.drop-down-list {
    transform-origin: top;

    border-radius: 5px;
    overflow: hidden;
}
</style>
