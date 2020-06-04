<template>
<ul class="variable-debugger">
  <variable v-for="(variable, name) in variables"
    :variable="variable"
    :name="name"
    :key="name" />
</ul>
</template>

<script>
import Variable from './Variable'

export default {
  components: {
    Variable
  },

  props: {
    'variables': {
      type: Object
    }
  }
}
</script>

<style lang="scss">
.variable-debugger {
    padding: 15px 20px 18px 15px;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    background-color: #282c34;
    border: solid 2px rgb(75, 82, 97);
    border-right: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-y: auto;

    .variable:not(:last-child) {
        margin-bottom: 10px;
    }
}
</style>
