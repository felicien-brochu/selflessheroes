<template>
<div>
  <p v-bbcode>{{
		$text('level_help_tab_step_if_statement_1')
	}}</p>

  <h5>{{$text('level_help_tab_statement_graph_code_example')}}</h5>
  <p>
    <simple-graph-code :code="'if e == wall :\nstep(w)\nelse\nstep(e)\nendif\n'"
      :compilerConfig="compilerConfig" />

    <span v-bbcode>{{
		$text('level_help_tab_step_if_statement_2')
	}}</span>
  </p>
  <p v-bbcode>{{$text('level_help_tab_step_if_statement_3')}}</p>

  <p v-bbcode>{{$text('level_help_tab_step_if_statement_4')}}</p>
  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>
  <p class="code"
    v-bbcode>{{$text('level_help_tab_step_if_statement_5')}}</p>
  <br />
  <br />
  <p v-bbcode>{{$text('level_help_tab_step_if_statement_6')}}</p>
  <h5>{{$text('level_help_tab_statement_graph_code_example')}}</h5>
  <p>
    <simple-graph-code :code="'if e == wall || e == hole :\nstep(w)\nendif\n'"
      :compilerConfig="compilerConfig" />

    <span v-bbcode>{{
			$text('level_help_tab_step_if_statement_7')
		}}</span>
  </p>

  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>
  <p class="code"
    v-bbcode>{{$text('level_help_tab_step_if_statement_8')}}</p>
</div>
</template>

<script>
import SimpleGraphCode from './SimpleGraphCode'

export default {
  components: {
    SimpleGraphCode
  },
  props: {
    compilerConfig: Object
  }
}
</script>

<style lang="scss">
</style>
