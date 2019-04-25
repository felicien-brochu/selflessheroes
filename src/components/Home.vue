<template>
<div class="home"
  @mousedown="handleClickOutside"
  @touchstart="handleClickOutside">
  <div class="career-list">

    <router-link v-for="career in careers"
      class="career-item"
      :key="career.id"
      tag="div"
      :to="career.url">{{
				career.name
			}}</router-link>

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
        class="career-item">
        <p class="new-career-form">
          <label for="name">Name:</label>
          <input id="name"
            v-model="name"
            type="text"
            name="name"
            autofocus />
          <button class="material-icons"
            type="submit">arrow_forward</button>
        </p>
      </form>
    </transition>
  </div>



</div>
</template>

<script>
import storage from '../game/storage/Storage'

export default {
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
.home {
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

        .career-item {
            width: 200px;
            height: 250px;
            margin-right: 20px;
            border-radius: 10px;
            background-color: #c4a14e;
            color: darken(#c4a14e, 38%);
            font-size: 24px;
            text-align: center;
            line-height: 100px;
            font-weight: 500;
            box-shadow: 0 0 10px 5px transparentize(#21252B, 0);
            cursor: pointer;

            &:hover {
                background-color: #e8be5c;
            }
        }

        .add-button-wrapper {
            height: 250px;
            width: 200px;
            display: flex;
            align-items: center;
            justify-content: center;

            button {
                text-shadow: 0 0 5px transparentize(#21252B, 0);
                color: transparentize(white, 0.7);
                font-size: 80px;
                &:hover {
                    color: transparentize(white, 0.5);
                }
            }
        }

        .new-career-form {
            line-height: 26px;
            button {
                color: white;
                font-size: 36px;
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
