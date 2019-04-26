import textFit from './textFit'

export default {
  name: 'text-fit',
  inserted: function(el, binding) {
    textFit(el, binding.value)
  },
  updated: function(el, binding) {
    textFit(el, binding.value)
  }
}