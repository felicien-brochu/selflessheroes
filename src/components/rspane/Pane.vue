<template>
<div class="Pane">
  <slot>Content</slot>
</div>
</template>

<script>
export default {
  name: 'pane-comp',
  data() {
    return {}
  },
}
</script>

<style scoped>
.Pane {
  overflow: hidden;
}

.Pane .columns {
  flex-direction: row;
  left: 0;
  right: 0;
}

.Pane .rows {
  flex-direction: column;
  bottom: 0;
  top: 0;
  min-height: 100%;
  width: 100%;
}
</style>
