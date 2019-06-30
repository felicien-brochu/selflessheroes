<template>
<modal class="help-modal"
  ref="modal"
  type="info"
  :cancelable="false"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <h3>{{$text('level_help_modal_title')}}</h3>

  <div class="tab-view">
    <ul class="tabs">

      <li v-for="(tab, index) in tabs"
        :class="{
				'selected': index === selectedTab
			}"
        @mousedown="selectTab(index)"
        @touchstart="$event.preventDefault(); selectTab(index)">
        <palette-statement v-if="tab.type === 'statement-tab'"
          :statement="tab.statement" />

        <div v-else>{{
				tab.title
			}}</div>
      </li>

    </ul>

    <component class="tab-content"
      :is="currentTab.component"
      v-bind="currentTab.props" />

  </div>
</modal>
</template>

<script>
import Modal from '../../modal/Modal'
import GeneralTab from './GeneralTab'

import PaletteStatement from '../grapheditor/PaletteStatement'
import {
  assignStatementType,
  actionStatementType,
  branchingStatementType
}
from '../grapheditor/PaletteStatementType'

import IfStatement from '../../../world/ai/compile/statements/IfStatement'
import JumpStatement from '../../../world/ai/compile/statements/JumpStatement'
import ActionFunctions from '../../../world/ai/compile/statements/functions/ActionFunctions'
import ValueFunctions from '../../../world/ai/compile/statements/functions/ValueFunctions'

const branchingStatements = [
  IfStatement,
  JumpStatement
]
const actionFunctions = Object.values(ActionFunctions)
const valueFunctions = Object.values(ValueFunctions)
const paletteStatements = [
  ...branchingStatements,
  ...valueFunctions,
  ...actionFunctions
]

export default {
  components: {
    Modal,
    PaletteStatement,
    GeneralTab
  },
  props: {
    'compilerConfig': {
      type: Object
    },
    'confirmValue': {
      default: true
    },
    'frameWidth': {
      type: Number,
      default: window.innerWidth
    },
    'frameHeight': {
      type: Number,
      default: window.innerHeight
    }
  },

  data: function() {
    let tabs = []
    tabs.push({
      type: 'text-tab',
      title: this.$text('level_help_modal_tab_general_title'),
      component: GeneralTab,
      props: {}
    })

    let primaryStatements = [...this.compilerConfig.getAllowedPrimaryStatements(), ...this.compilerConfig.valueFunctions]
    for (let statement of this.getStatements()) {
      tabs.push({
        type: 'statement-tab',
        statement: statement,
        component: 'div',
        props: {}
      })
    }

    return {
      tabs: tabs,
      selectedTab: 0,
      currentTab: tabs[0]
    }
  },

  methods: {
    confirm() {
      this.$refs.modal.confirm()
    },

    cancel() {
      this.$refs.modal.cancel()
    },

    selectTab(tabIndex) {
      this.selectedTab = tabIndex
      this.currentTab = this.tabs[tabIndex]
    },

    getStatements() {
      if (!this.compilerConfig) {
        return []
      }

      let primaryStatements = [...this.compilerConfig.getAllowedPrimaryStatements(), ...this.compilerConfig.valueFunctions]
      let statementClasses = primaryStatements.filter(statementClass => paletteStatements.indexOf(statementClass) >= 0)
      let statements = statementClasses.map(statementClass => {
        return {
          clazz: statementClass
        }
      })
      let branching = statementClasses.filter(statementClass => branchingStatements.indexOf(statementClass) >= 0)
      let actions = statementClasses.filter(statementClass => actionFunctions.indexOf(statementClass) >= 0)
      let assign = statementClasses.filter(statementClass => valueFunctions.indexOf(statementClass) >= 0)
      branching = branching.map(statementClass => {
        return {
          statementType: branchingStatementType,
          clazz: statementClass
        }
      })
      actions = actions.map(statementClass => {
        return {
          statementType: actionStatementType,
          clazz: statementClass
        }
      })
      assign = assign.map(statementClass => {
        return {
          statementType: assignStatementType,
          clazz: statementClass
        }
      })

      return [
        ...branching,
        ...actions,
        ...assign
      ]
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';
$selected-color: #535866;

.help-modal {
    padding: 20px 50px 30px;
    min-width: 485px;

    .modal-content {
        display: flex;
        flex-direction: column;

        h3 {
            font-weight: bold;
            font-size: 36px;
            margin: 0 0 20px;
        }

        .tab-view {
            display: flex;
            flex-direction: row;
            padding-left: 10px;
            border-radius: 10px;
            overflow: hidden;
            background: #32363E;

            .tabs {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                width: min-content;
                font-size: 21px;
                padding-bottom: 30px;
                padding-top: 20px;

                & > li {
                    padding: 3px 7px 4px;
                    border-radius: 6px 0 0 6px;
                    text-align: start;
                    width: 100%;
                    box-sizing: border-box;
                    cursor: pointer;

                    &.selected {
                        background: $selected-color;
                    }
                }

                .palette-statement {
                    box-shadow: none;
                }
            }

            .tab-content {
                border-left: solid 5px $selected-color;
                background: #282C34;
                min-height: 100%;
                min-width: 300px;
                box-sizing: border-box;
                flex-grow: 1;
                margin-left: -1px;
            }
        }
    }

    .button-container {
        margin-top: 17px;
    }
}
</style>
