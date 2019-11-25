<template>
<div class="tab general-tab">
  <button class="basic-tutorial-button"
    :title="$text('level_help_basic_tutorial_button')"
    @click="handleBasicTutorialClick">{{
			$text('level_help_basic_tutorial_button')
		}}<i class="mdi mdi-arrow-right-circle" />
  </button><button class="advanced-tutorial-button"
    :title="$text('level_help_advanced_tutorial_button')"
    @click="handleAdvancedTutorialClick">{{
			$text('level_help_advanced_tutorial_button')
		}}<i class="mdi mdi-arrow-right-circle" />
  </button>
</div>
</template>

<script>
import BasicTutorialConfig from '../tutorial/BasicTutorialConfig'
import AdvancedTutorialConfig from '../tutorial/AdvancedTutorialConfig'

export default {
  components: {},
  props: {},
  methods: {
    handleBasicTutorialClick() {
      this.$emit('start-tutorial', BasicTutorialConfig)
    },

    handleAdvancedTutorialClick() {
      this.$emit('start-tutorial', AdvancedTutorialConfig)
    }
  }
}
</script>

<style lang="scss">
.general-tab {
    button {
        display: block;
        background: #568AF2;
        margin: 0;
        padding: 0 5px 0 15px;
        outline: none;
        border: none;
        cursor: pointer;
        color: white;
        font-size: 18px;
        font-weight: 500;
        border-radius: 16px;
        box-shadow: 0 0 7px 0 rgba(0,0,0,0.4);
        line-height: 32px;
        margin-bottom: 14px;

        .mdi-arrow-right-circle {
            display: inline-flex;
            font-size: 25px;
            margin-left: 8px;
            vertical-align: bottom;
        }
    }
}
</style>
