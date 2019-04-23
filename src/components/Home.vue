<template>
<div class="home">
  <ul class="career-list">

    <router-link v-for="career in careers"
      :key="career.id"
      tag="li"
      :to="career.url">{{
				career.name
			}}</router-link>

  </ul>


  <form @submit="createCareer"
    action="/"
    method="post">
    <p>
      <label for="name">New Game:</label>
      <input id="name"
        v-model="name"
        type="text"
        name="name">
    </p>

    <p>
      <input type="submit"
        value="OK">
    </p>
  </form>
</div>
</template>

<script>
import storage from '../game/storage/Storage'

export default {
  components: {},

  data: function() {
    return {
      name: null
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
    }
  }
}
</script>

<style lang="scss">
.home {
    color: #ABB2BF;
    background-color: #282C34;
}
</style>
