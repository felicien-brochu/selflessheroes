<template>
	<div id="app">
		<world/>
		<rs-panes split-to="columns" :allow-resize="true" :size="200" :min-size="100">
      <editor slot="firstPane"/>
      <div slot="secondPane"/>
    </rs-panes>
	</div>
</template>

<script>
import World from './components/World'
import Editor from './components/Editor'

export default {
	components: {
		World,
		Editor
	}
}
</script>

<style lang="scss">
html,
body {
	margin: 0;
	padding: 0;
	background-color: #a99ea2;
}

#app {
	margin: 0 auto;

	// > * {
	// 	display: block;
	// }
}

h1 {
	text-align: center;
	color: red;
}
</style>
