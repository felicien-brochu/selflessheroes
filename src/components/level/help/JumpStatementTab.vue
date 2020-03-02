<template>
<div class="help-jump-statement-tab">
  <p v-bbcode>{{
		$text('level_help_tab_jump_statement_1')
	}}</p>

  <h5>{{$text('level_help_tab_statement_graph_code_example')}}</h5>
  <p>
    <div class="graph-code-container">
      <simple-graph-code :code="'a:\nstep(e)\njump a'"
        :compilerConfig="defaultCompilerConfig" />
      <svg viewBox="0 0 100 126"
        style="height: 126px;"
        class="jump-link-layer">
        <path d="M 0 112 C 68 112, 73 20, 5 20"
          v-svgid.url="{
						id: '#arrow',
						attr: 'marker-end'
					}"
          class="link-line" />
      </svg>
    </div>

    <span v-bbcode>{{$text('level_help_tab_jump_statement_2')}}</span>
  </p>

  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>

  <p class="code"
    v-bbcode>{{$text('level_help_tab_jump_statement_3')}}</p>

  <p v-bbcode>{{
			$text('level_help_tab_jump_statement_4')
		}}</p>

  <br />
  <p v-bbcode>{{
			$text('level_help_tab_jump_statement_5')
		}}</p>

  <h5>{{$text('level_help_tab_statement_graph_code_example')}}</h5>
  <p>
    <div class="graph-code-container">
      <svg viewBox="0 0 100 172"
        class="jump-link-layer"
        style="height: 172px;">
        <path d="M 19 158 C 97 158, 83 20, 5 20"
          v-svgid.url="{
						id: '#arrow',
						attr: 'marker-end'
					}"
          class="link-line" />
      </svg>
      <simple-graph-code :code="'a:\nstep(e)\nif e != wall :\n  jump a\nendif\n'"
        :compilerConfig="defaultCompilerConfig" />
    </div>

    <span v-bbcode>{{$text('level_help_tab_jump_statement_6')}}</span>
  </p>

  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>

  <p class="code"
    v-bbcode>{{$text('level_help_tab_jump_statement_7')}}</p>
</div>
</template>

<script>
import SimpleGraphCode from './SimpleGraphCode'
import CompilerConfig from '../../../world/ai/compile/CompilerConfig'

export default {
  components: {
    SimpleGraphCode
  },
  props: {
    compilerConfig: Object
  },
  computed: {
    defaultCompilerConfig: function() {
      return CompilerConfig.getDefault()
    }
  }
}
</script>

<style lang="scss">
.help-jump-statement-tab {
    .graph-code-container {
        position: relative;
        svg.jump-link-layer {
            position: absolute;
            top: -3px;
            left: 0;
            width: 268px;
        }
    }
}
</style>
