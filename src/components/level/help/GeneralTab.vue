<template>
<div class="tab general-tab">
  <button class="link-button"
    :title="$text('level_help_basic_tutorial_button')"
    @click="handleBasicTutorialClick">{{
			$text('level_help_basic_tutorial_button')
		}}<i class="mdi mdi-arrow-right-circle" />
  </button><button class="link-button"
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
    button.link-button {
        display: block;
    }
}
</style>
