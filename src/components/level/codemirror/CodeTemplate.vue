<template>
<span class="code-template">
  <span v-for="(segment, index) in segments"
    :key="index"
    :class="segment.classNames">{{ segment.text }}</span>
</span>
</template>

<script>
export default {
  props: {
    template: String
  },

  computed: {
    segments: function() {
      let strings = this.template.split('%%')
      let segments = []
      let nextSegment = 1
      for (let i = 0; i < strings.length; i++) {
        let str = strings[i]
        if (i === nextSegment) {
          let sepIndex = str.indexOf('$')
          let type = str.substring(0, sepIndex)
          let code = str.substring(sepIndex + 1)
          segments.push({
            text: code,
            classNames: ['code-segment', `type-${type}`]
          })
          nextSegment += 2
        }
        else {
          segments.push({
            text: str,
            classNames: ['text-segment']
          })
        }
      }
      return segments
    }
  }
}
</script>

<style lang="scss">
.code-segment {
    font-family: Consolas, 'DejaVu Sans Mono', monospace;
    background-color: #282C34;
    padding: 2px 4px;
    border-radius: 5px;
}

.type-undefined {
    color: #d19a66;
}
.type-function {
    color: hsl(207, 82%, 66%);
}
.type-variable {
    color: #e06c75;
}
.type-keyword {
    color: #c678dd;
}
.type-literal {
    color: #d19a66;
}
.type-operator {
    color: #56b6c2;
}
.type-bracket {
    color: #abb2bf;
    font-style: italic;
}
</style>
