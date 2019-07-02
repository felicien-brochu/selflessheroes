<template>
<modal class="help-modal"
  ref="modal"
  type="info"
  :cancelable="false"
  :confirmValue="confirmValue"
  v-bind="$props"
  @close="$emit('close')"
  @confirm="$emit('confirm', $event)"
  @cancel="$emit('cancel', $event)">

  <h3>{{$text('level_help_modal_title')}}</h3>

  <div class="scroll">
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

      <component class="tab"
        :is="currentTab.component"
        v-bind="currentTab.props"
        v-on="currentTab.handlers" />

    </div>
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
import CalcFunction from '../../../world/ai/compile/statements/functions/CalcFunction'
import DropFunction from '../../../world/ai/compile/statements/functions/DropFunction'
import FireBallFunction from '../../../world/ai/compile/statements/functions/FireBallFunction'
import SetFunction from '../../../world/ai/compile/statements/functions/SetFunction'
import StepFunction from '../../../world/ai/compile/statements/functions/StepFunction'
import StepOnceFunction from '../../../world/ai/compile/statements/functions/StepOnceFunction'
import TakeFunction from '../../../world/ai/compile/statements/functions/TakeFunction'
import WriteFunction from '../../../world/ai/compile/statements/functions/WriteFunction'
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


import IfStatementTab from './IfStatementTab'
import StepFunctionTab from './StepFunctionTab'
import StepOnceFunctionTab from './StepOnceFunctionTab'
// IfStatement
// JumpStatement
// CalcFunction
// DropFunction
// FireBallFunction
// SetFunction
// StepFunction
// StepOnceFunction
// TakeFunction
// WriteFunction
const statementTabs = new Map([
  [IfStatement, {
    component: IfStatementTab,
    props: {}
  }],
  [StepFunction, {
    component: StepFunctionTab,
    props: {}
  }],
  [StepOnceFunction, {
    component: StepOnceFunctionTab,
    props: {}
  }]
])
// {
//   'step_once': {
//     component: StatementTab,
//     props: {
//       text: 'level_help_tab_step_once'
//     }
//   }
// }

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
      props: {},
      handlers: {
        'start-tutorial': this.handleStartTutorial
      }
    })

    let primaryStatements = [...this.compilerConfig.getAllowedPrimaryStatements(), ...this.compilerConfig.valueFunctions]
    for (let statement of this.getStatements()) {
      let tab = statementTabs.get(statement.clazz)
      if (!tab) {
        tab = {
          component: 'div',
          props: {}
        }
      }

      Object.assign(tab, {
        type: 'statement-tab',
        handlers: {},
        statement: statement
      })
      tab.props.compilerConfig = this.compilerConfig
      tabs.push(tab)
    }

    return {
      tabs: tabs,
      selectedTab: 0,
      currentTab: tabs[0],
      confirmValue: {
        action: null
      }
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

    handleStartTutorial(config) {
      this.$refs.modal.confirm({
        action: 'start-tutorial',
        tutorialConfig: config
      })
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

        .scroll {
            overflow-x: hidden;
            overflow-y: auto;

            .tab-view {
                display: flex;
                flex-direction: row;
                padding-left: 10px;
                border-radius: 10px;
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

                .tab {
                    border-left: solid 5px $selected-color;
                    background: #282C34;
                    min-height: 100%;
                    min-width: 300px;
                    box-sizing: content-box;
                    flex-grow: 1;
                    margin-left: -1px;
                    color: transparentize(white, 0.2);
                    font-size: 18px;
                    padding: 23px 15px 20px 23px;
                    text-align: start;
                    white-space: normal;
                    border-radius: 0 10px 10px 0;

                    .simple-graph-code {
                        margin: 15px;
                    }

                    p {
                        margin-top: 0;
                    }

                    .statement {
                        border-radius: 4px;
                        font-weight: 500;
                        padding: 0 10px 0 5px;
                    }

                    h5 {
                        font-size: 16px;
                        margin: 6px 0;
                        font-weight: 500;
                    }

                    .code {
                        font-family: Consolas, 'DejaVu Sans Mono', monospace;
                        white-space: pre;
                        font-size: 18px;
                        line-height: 24px;
                        color: #abb2bf;
                        background-color: #1F2229;
                        padding: 2px 4px;
                        border-radius: 5px;
                        padding: 7px 13px;
                    }

                    .text-segment {
                        white-space: pre-wrap;
                    }

                    .action-statement {
                        @include node-color($action-color);
                    }
                    .branching-statement {
                        @include node-color($branching-color);
                    }
                    .assign-statement {
                        @include node-color($assign-color);
                    }
                }
            }
        }
    }

    .button-container {
        margin-top: 17px;
    }
}
</style>
