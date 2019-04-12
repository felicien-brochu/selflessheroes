<template>
<ul class="drop-down-list">

</ul>
</template>

<script>
import Vue from 'vue'
import DropDownItem from './DropDownItem'

import VariableIdentifier from '../../../world/ai/compile/statements/VariableIdentifier'
import ObjectTypeLiteral from '../../../world/ai/compile/statements/literals/ObjectTypeLiteral'
import TerrainTypeLiteral from '../../../world/ai/compile/statements/literals/TerrainTypeLiteral'
import DirectionLiteral from '../../../world/ai/compile/statements/literals/DirectionLiteral'
import IntegerLiteral from '../../../world/ai/compile/statements/literals/IntegerLiteral'
import ObjectType from '../../../world/ObjectType'
import TerrainType from '../../../world/TerrainType'

const verticalPadding = 10
const horizontalPadding = 8

export default {
  props: {
    'value': {
      type: [Object, String]
    },
    'types': {
      type: Array
    },
    'anchor': {
      type: Element
    },
    'frame': {
      type: Element
    },
    'compilerConfig': {
      type: Object
    }
  },
  data: function() {
    return {}
  },

  mounted() {
    this.createItems()
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

    updatePosition() {
      let anchorBox = this.anchor.getBoundingClientRect()
      let frameBox = this.frame.getBoundingClientRect()
      let thisBox = this.$el.getBoundingClientRect()
      let x = anchorBox.x
      let y = anchorBox.y

      // Keep the drop down list in the frame if possible
      if (x < frameBox.left + horizontalPadding) {
        x = frameBox.left + horizontalPadding
      }
      if (x + thisBox.width > frameBox.right - horizontalPadding) {
        x = frameBox.right - thisBox.width - horizontalPadding
      }
      if (y + thisBox.height > frameBox.bottom - verticalPadding) {
        y = frameBox.bottom - thisBox.height - verticalPadding
      }
      if (y < frameBox.top + verticalPadding) {
        y = frameBox.top + verticalPadding
      }

      this.$el.style.left = `${x}px`
      this.$el.style.top = `${y}px`
    },

    handleItemSelectValue(value) {
      this.valueSelected = true
      this.$emit('select-value', value)
    },

    createItems() {
      let items = []
      for (let type of this.types) {
        if (type === DirectionLiteral) {
          items.push(this.createDirectionItem())
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
      }
      for (let item of items) {
        item.$mount()
        item.$parent = this
        item.$on('select-value', this.handleItemSelectValue)
        this.$el.appendChild(item.$el)
      }
    },

    createDirectionItem() {
      let item = new(Vue.extend(DropDownItem))({
        propsData: {
          label: 'direction',
          value: DirectionLiteral,
          selected: this.value instanceof DirectionLiteral
        }
      })
      return item
    },

    createVariableItems() {
      let items = []
      for (let identifier of this.compilerConfig.getAllowedVariableIdentifiers()) {
        let variable = new VariableIdentifier(null)
        variable.name = identifier
        let item = new(Vue.extend(DropDownItem))({
          propsData: {
            label: variable.name,
            value: variable,
            selected: this.value instanceof VariableIdentifier && this.value.name === variable.name
          }
        })
        items.push(item)
      }
      return items
    },

    createObjectTypeItems() {
      let items = []
      for (let objectType of this.compilerConfig.objectTypes) {
        let literal = new ObjectTypeLiteral(null)
        literal.name = objectType
        literal.value = ObjectType[objectType]
        let item = new(Vue.extend(DropDownItem))({
          propsData: {
            label: literal.name,
            value: literal,
            selected: this.value instanceof ObjectTypeLiteral && this.value.value === literal.value
          }
        })
        items.push(item)
      }
      return items
    },

    createTerrainTypeItems() {
      let items = []
      for (let terrainType of this.compilerConfig.terrainTypes) {
        let literal = new TerrainTypeLiteral(null)
        literal.name = terrainType
        literal.value = TerrainType[terrainType]
        let item = new(Vue.extend(DropDownItem))({
          propsData: {
            label: literal.name,
            value: literal,
            selected: this.value instanceof TerrainTypeLiteral && this.value.value === literal.value
          }
        })
        items.push(item)
      }
      return items
    }
  }

}
</script>

<style lang="scss">
@import '../constants';

.drop-down-list {
    @include node-shadow;
    position: absolute;
    list-style: none;
    padding: 0;
    margin: 0;

    border-radius: 3px;
    overflow: hidden;
}
</style>
