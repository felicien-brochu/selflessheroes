<template>
<span class="code-template">
  <span v-for="(segment, index) in segments"
    :key="index"
    :class="segment.classNames">{{
	segment.text
}}</span>
</span>
</template>

<script>
export default {
  props: {
    template: String
  },

  computed: {
    segments: function() {
      let strings = this.template.split('%')
      let segments = []
      let nextSegment = 1
      for (let i = 0; i < strings.length; i++) {
        let str = strings[i]
        if (i === nextSegment) {
          if (str.length !== 0) {
            segments.push({
              text: str,
              classNames: ['code-segment', `keyword-${str}`]
            })
          }
          else if (i < strings.length - 1) {
            strings[i + 1] = '%' + strings[i + 1]
          }
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

.keyword-undefined {
    // border-bottom: 2px #4f5e7b solid;
    color: #d19a66;
}
</style>
