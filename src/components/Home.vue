<template>
<div class="home"
  @mousedown="handleClickOutside"
  @touchstart="handleClickOutside">

  <h1>{{$text('home_title')}}</h1>

  <modal-layer ref="modalLayer" />

  <div class="career-list">

    <router-link v-for="career in careers"
      class="career-item"
      :key="`career${career.id}`"
      tag="div"
      :to="career.url">

      <button class="remove-button material-icons"
        type="button"
        :title="$text('remove_career_button')"
        @click="removeCareer(career.id, $event)"
        @touchstart="removeCareer(career.id, $event)">remove_circle</button>

      <div class="career-name"
        v-text-fit="{
		      alignHoriz: true,
		      alignVert: true
		    }">{{
				career.name
			}}</div>

    </router-link>

    <transition name="fade"
      mode="out-in">
      <div v-if="!newCareer && careers.length > 0"
        class="add-button-wrapper"
        @mousedown="newCareer = true"
        @touchstart="newCareer = true">

        <button class="material-icons"
          type="button">add_circle</button>

      </div>

      <form v-else
        @submit="createCareer"
        action="/"
        method="post"
        class="career-item new-career-form"
        key="new-career-form">

        <h3 v-text-fit="{
		      alignHoriz: true,
		      alignVert: true
		    }">{{$text('new_game')}}</h3>

        <div class="name-input-wrapper">

          <div class="input-wrapper">
            <input id="name"
              v-model="name"
              type="text"
              name="name"
              autocomplete="off"
              v-focus
              :placeholder="$text('new_game_name_placeholder')" />
          </div>

          <button class="material-icons"
            type="submit">arrow_forward</button>

        </div>

      </form>

    </transition>

  </div>

</div>
</template>

<script>
import ModalLayer from './modal/ModalLayer'
import Modal from './modal/Modal'
import storage from '../game/storage/Storage'

export default {
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },

  components: {
    ModalLayer
  },

  data: function() {
    return {
      name: null,
      newCareer: false,
      storage: storage
    }
  },

  computed: {
    careers: function() {
      let careers = []
      for (let career of this.storage.careers) {
        career.get()
        careers.push({
          id: career.id,
          name: career.name,
          url: `c/${career.id}/`
        })
      }
      return careers
    }
  },

  methods: {
    createCareer(e) {
      if (this.name && this.name.length > 0) {
        let career = storage.createCareer(this.name)
        if (career) {
          const url = `c/${career.id}/`
          this.$router.push(url)
        }
      }
      e.preventDefault()
    },

    handleClickOutside(e) {
      if (e.target === this.$el) {
        this.newCareer = false
      }
    },

    removeCareer(careerID, e) {
      e.preventDefault()
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'remove-career-warning',
        props: {
          text: this.$text('remove_career_warning'),
          cancelable: true,
          confirmValue: careerID
        },
        handlers: {
          confirm: this.confirmRemoveCareer
        }
      })
    },

    confirmRemoveCareer(careerID) {
      console.log("REMOVE career", careerID)
      storage.removeCareer(careerID)
    }
  }
}
</script>

<style lang="scss">
@import './main';
.home {
    @include no-select;

    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100vh;
    padding: 20px 40px;
    color: #ABB2BF;
    background-color: #282C34;

    h1 {
        font-size: 60px;
        text-align: center;
        font-weight: 500;
        color: white;
        margin: 40px 0 80px;
    }

    button {
        background: none;
        border: none;
        outline: none;
        padding: 0;
        cursor: pointer;
    }

    .career-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 0;
        padding: 0;
        height: max-content;

        .career-item {
            @include home-card($default-card-color);
            padding: 49px 30px 30px;
            display: flex;
            flex-direction: column;

            .remove-button {
                position: absolute;
                top: 0;
                right: 0;
                margin: 14px 16px;
                width: 24px;
                height: 24px;
                color: white;
                opacity: 0;
                font-size: 24px;
                line-height: 24px;
                transition: all 100ms ease;
                opacity: 0.1;
                &:hover {
                    opacity: 0.5;
                }
            }

            .career-name {
                width: 220px;
                height: 60px;
                text-align: center;
                font-weight: 500;
            }
        }

        .add-button-wrapper {
            @include card-box;
            border: dashed #ffffff1a 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.6s, border-color 0.2s ease;
            cursor: pointer;

            button {
                transition: opacity 0.5s ease;
                opacity: 0.09;
                color: #ffffff;
                font-size: 90px;
            }

            &:hover {
                background-color: lighten(#282C34, 10%);
                border-color: #ffffff00;
                button {
                    opacity: 0.7;
                }
            }
        }

        .new-career-form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-bottom: 80px;
            cursor: default;

            h3 {
                font-weight: 500;
                margin: 0 0 25px;
                width: 220px;
                height: 36px;
                text-transform: capitalize;
            }

            .name-input-wrapper {
                display: flex;
                flex-direction: row;
                justify-content: center;

                .input-wrapper {
                    margin-left: 5px;

                    input[type=text] {
                        border-radius: 5px;
                        border: none;
                        font-size: 24px;
                        padding: 7px 12px;
                        box-sizing: border-box;
                        width: 100%;
                        font-family: inherit;
                        font-weight: 500;
                        color: $default-card-color;
                    }
                }

                button {
                    color: white;
                    font-size: 44px;
                    padding: 0;
                    margin-left: 6px;
                    flex-shrink: 0;
                }
            }
        }
    }
}

.fade-enter-active {
    transition: opacity 0.5s ease;
}

.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
