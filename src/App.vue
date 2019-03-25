<template>
	<div id="app">
		<world/>
		<rs-panes split-to="columns" v-on:update:size="handleResize" :allow-resize="true" :size="40" :min-size="10" units="percents">
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
	},
	mounted() {
	},
	methods: {
		handleResize(e) {
			window.game.scene.keys.GameScene.handleResizeCamera(e)
		}
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
