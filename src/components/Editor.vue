<template>
		<textarea id="editor">
//JS code
let pori = 4
for (let i = 0; i < pori; i++) {

}
		</textarea>
</template>

<script>
import CodeMirror from 'codemirror'
import js from 'codemirror/mode/javascript/javascript'

import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/darcula.css';
import '../one-dark.css';

export default {
	components: {
	},
	mounted: function () {
		let container = document.getElementById('editor')
		let editor = CodeMirror.fromTextArea(container, {
			lineNumbers: true,
			mode: 'javascript',
			theme: 'one-dark',
			viewportMargin: Infinity,
			matchBrackets: true,
		})
	}
}
</script>

<style lang="scss">

.CodeMirror {
	padding-top: 30px;
	height: 100%;
	width: 100%;
}

</style>
