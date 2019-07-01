<template>
<div>
  <p v-bbcode>{{
		$text('level_help_tab_step_once_function_1')
	}}</p>

  <p>
    <simple-graph-code code="step(e)"
      :compilerConfig="compilerConfig" />

    <span v-bbcode>{{
		$text('level_help_tab_step_once_function_2')
	}}</span>
  </p>

  <br />
  <h5>{{$text('level_help_tab_statement_code_example')}}</h5>
  <p class="code"
    v-bbcode>{{$text('level_help_tab_step_once_function_3')}}</p>
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
