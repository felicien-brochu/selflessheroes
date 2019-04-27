<template>
<transition :duration="{enter: 200, leave: 150}">
  <div class="modal-layer"
    v-show="modals.length > 0"
    @mousedown="handleOutsideClick"
    @touchstart="handleOutsideClick">

    <transition name="pop"
      appear>
      <component v-for="(modal, index) in modals"
        ref="modals"
        :key="modal.key"
        :is="modal.component"
        v-bind="modal.props"
        v-on="modal.handlers"
        @close="removeModal(index)"></component>
    </transition>

  </div>
</transition>
</template>

<script>
export default {
  data: function() {
    return {
      modals: []
    }
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
      this.modals.push(modalOptions)
    },

    closeModal(index) {
      this.$refs.modals[index].cancel()
    },

    removeModal(index) {
      this.modals.splice(index, 1)
    },

    closeLastModal() {
      if (this.modals.length > 0) {
        this.closeModal(this.modals.length - 1)
      }
    },

    handleOutsideClick(e) {
      let target = e.touches && e.touches[0].target || e.target
      if (target === this.$el) {
        this.closeLastModal()
      }
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

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%) scale(1) rotate(-1deg);

        &.pop-enter-active {
            transition: all 0.20s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        &.pop-leave-active {
            transition: all 0.15s ease;
        }

        &.pop-enter {
            transform: translate(-50%, -50%) scale(0.5) rotate(10deg);
            opacity: 0;
        }

        &.pop-leave-to {
            transform: translate(-50%, -50%) scale(0) rotate(10deg);
            opacity: 0;
        }
    }

}
</style>
