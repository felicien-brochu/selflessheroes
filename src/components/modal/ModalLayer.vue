<template>
<transition :duration="{enter: 200, leave: 150}">
  <div :class="{
			'modal-layer': true,
			'blurred': autoBlur && !!modal,
		}"
    v-show="!!modal">
    <div class="modal-scroll-container"
      ref="scrollContainer"
      @click.stop="handleOutsideClick">

      <component v-if="!!modal"
        ref="modal"
        :key="modal.key"
        :is="modal.component"
        :frameWidth="frameWidth"
        :frameHeight="frameHeight"
        v-bind="modal.props"
        v-on="modal.handlers"
        @close="closeModal" />

    </div>
  </div>
</transition>
</template>

<script>
export default {
  props: {
    'horizontalPadding': {
      type: Number,
      default: 20
    },
    'verticalPadding': {
      type: Number,
      default: 24
    },
    'autoBlur': {
      type: Boolean,
      default: false
    },
  },
  data: function() {
    return {
      modal: null,
      width: window.innerWidth,
      height: window.innerHeight
    }
  },

  computed: {
    frameWidth: function() {
      return this.width - 2 * this.horizontalPadding
    },
    frameHeight: function() {
      return this.height - 2 * this.verticalPadding
    }
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {
    // options are of this form:
    // {
    //   component: ComponentClass,
    //   key: 'myKey',
    //   props: {
    //     //...my props...
    //   },
    //   handlers: {
    //     //...my handlers...
    //   }
    // }
    addModal(modalOptions) {
      if (this.modal) {
        this.$refs.modal.cancel()
      }
      this.modal = modalOptions
    },

    closeModal() {
      this.modal = null
    },

    handleOutsideClick(e) {
      let target = e.touches && e.touches[0].target || e.target
      if (target === this.$el || target === this.$refs.scrollContainer) {
        if (this.$refs.modal) {
          this.$refs.modal.cancel()
        }
      }
    },

    handleWindowResize() {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
  }
}
</script>

<style lang="scss">
.modal-layer {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 200;
    background-color: rgba(40,44,52,0);
    transition: all 0.25s ease-out;
    overflow-x: hidden;
    overflow-y: auto;

    &.blurred {
        background-color: rgba(40,43,51,0.86);
    }

    .modal-scroll-container {
        display: flex;
        justify-content: center;
        padding: 24px;
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
        box-sizing: border-box;
        align-items: center;

        .modal {
            // position: absolute;
            // top: 50%;
            // left: 50%;
            //
            // transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
    }
}
</style>
