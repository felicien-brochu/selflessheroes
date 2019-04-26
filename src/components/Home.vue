<template>
<div class="home"
  @mousedown="handleClickOutside"
  @touchstart="handleClickOutside">
  <div class="career-list">

    <router-link v-for="career in careers"
      class="career-item"
      :key="career.id"
      tag="div"
      :to="career.url">
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
        class="add-button-wrapper">

        <button class="material-icons"
          type="button"
          @mousedown="newCareer = true"
          @touchstart="newCareer = true">add_circle_outline</button>

      </div>

      <form v-else
        @submit="createCareer"
        action="/"
        method="post"
        class="career-item new-career-form">

        <h1 v-text-fit="{
		      alignHoriz: true,
		      alignVert: true
		    }">{{$text('new_game')}}</h1>

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
import storage from '../game/storage/Storage'

export default {
  directives: {
    focus: {
      // définition de la directive
      inserted: function(el) {
        el.focus()
      }
    }
  },

  components: {},

  data: function() {
    return {
      name: null,
      newCareer: false
    }
  },

  computed: {
    careers: function() {
      let careers = []
      for (let career of storage.careers) {
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
    }
  }
}
</script>

<style lang="scss">
@import './main';
.home {
    @include no-select;
    button {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
    }

    margin: 0 auto;
    height: 100vh;
    padding: 80px 40px;
    color: #ABB2BF;
    background-color: #282C34;
    display: flex;

    .career-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        height: max-content;

        .career-item {
            @include home-card($default-card-color);
            padding: 49px 30px 30px;
            display: flex;
            flex-direction: column;

            .career-name {
                width: 220px;
                height: 60px;
                text-align: center;
                font-weight: 500;
            }
        }

        .add-button-wrapper {
            @include card-box;
            background-color: #282C34;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 200ms ease;
            cursor: pointer;

            button {
                color: transparentize(white, 0.7);
                font-size: 120px;
            }

            &:hover {
                background-color: lighten(#282C34, 2%);
            }
        }

        .new-career-form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-bottom: 80px;

            h1 {
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
