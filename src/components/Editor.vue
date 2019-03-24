<template>
		<div id="editor"/>
</template>

<script>
import * as monaco from 'monaco-editor'
export default {
	components: {
	},
	mounted: function () {
		let container = document.getElementById('editor')
		let editor = monaco.editor.create(container, {
			value: [
				'function x() {',
				'\tconsole.log("Hello world!");',
				'}'
			].join('\n'),
			language: 'javascript',
			scrollbar: {
				vertical: 'auto',
				horizontal: 'auto'
			},
			theme: "vs-dark",
			automaticLayout: true,
		})
	}
}
</script>

<style lang="scss">

#editor {
	height: 100%;
	// margin: 0;
	// width: 400px;
	// min-width: 400px;
}

</style>
