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
  <h4>{{ $text('level_help_tab_general_objectives_stars') }}</h4>
  <ul>
    <li><strong><span class="icon icon-star" /> {{ $text('level_help_tab_general_objectives_star1') }}</strong> {{ $text('level_help_tab_general_objectives_star1_objective') }}</li>
    <li><strong><span class="icon icon-star" /> {{ $text('level_help_tab_general_objectives_star2') }}</strong> {{ $text('level_help_tab_general_objectives_star2_objective') }}
      <blockquote><i class="mdi mdi-clock-fast" />{{ $text('level_help_tab_general_objectives_star2_advice') }}</blockquote>
    </li>
    <li><strong><span class="icon icon-star" /> {{ $text('level_help_tab_general_objectives_star3') }}</strong> {{ $text('level_help_tab_general_objectives_star3_objective') }}
      <blockquote><i class="mdi mdi-format-list-numbered" />{{ $text('level_help_tab_general_objectives_star3_advice') }}</blockquote>
    </li>
  </ul>
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

    h4 {
        margin-top: 40px;
    }

    ul {
        padding-left: 10px;

        li {
            margin-bottom: 15px;

            blockquote {
                display: flex;
                align-items: center;
                font-style: italic;
                font-size: 15px;
                color: #8991a4;
                margin: 9px 20px 7px 0;
                text-align: justify;
                font-weight: 500;
                background-color: #22262d;
                border-radius: 6px;
                padding: 8px 12px;
                box-sizing: border-box;

                i {
                    font-size: 32px;
                    margin: 0 14px 0 4px;
                }
            }
        }
    }
}
</style>
