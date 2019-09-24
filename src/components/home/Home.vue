<template>
<div class="home"
  @mousedown="handleClickOutside"
  @touchstart="handleClickOutside"
  @drop.prevent.stop="handleDrop"
  @dragover.prevent="handleDragOver">

  <header></header>

  <modal-layer ref="modalLayer" />

  <div class="career-file-drop-overlay"
    v-if="careerFileDragged"
    @dragleave.prevent="handleDragLeave">
    <div class="career-file-drop-text"
      v-bbcode>{{$text('home_drop_career_file')}}</div>
  </div>

  <card-list class="career-list"
    :itemWidth="280"
    :horizontalMargin="15"
    :parentPadding="80"
    :centerOneLiner="true">

    <router-link v-for="career in careers"
      class="career-item"
      :key="`career${career.id}`"
      tag="li"
      :to="career.url">

      <div class="buttons-container">
        <button class="svae-button mdi mdi-content-save-move"
          type="button"
          :title="$text('home_save_career_button')"
          @click.prevent="saveCareer(career.id, $event)"
          @touchstart.prevent="saveCareer(career.id, $event)" />

        <button class="remove-button mdi mdi-minus-circle"
          type="button"
          :title="$text('home_remove_career_button')"
          @click.prevent="deleteCareer(career.id, $event)"
          @touchstart.prevent="deleteCareer(career.id, $event)" />
      </div>

      <div class="career-name"
        v-text-fit="{
		      alignHoriz: true,
		      alignVert: true
		    }">{{
				career.name
			}}</div>

      <div class="stars-count">
        <i class="star-icon"><span :class="{
					'number': true,
					'small': career.stars.toString().length >= 3
				}">{{
					career.stars
				}}</span></i>
      </div>

    </router-link>

    <transition name="fade"
      mode="out-in">
      <li v-if="!newCareer && careers.length > 0"
        class="add-button-wrapper"
        @mousedown="newCareer = true"
        @touchstart="newCareer = true">

        <button class="mdi mdi-plus-circle"
          type="button" />

      </li>

      <form v-else
        @submit="createCareer"
        action="/"
        method="post"
        class="career-item new-career-form"
        key="new-career-form">

        <h3 v-text-fit="{
		      alignHoriz: true,
		      alignVert: true
		    }">{{$text('home_new_game')}}</h3>

        <div class="name-input-wrapper">

          <div class="input-wrapper">
            <input id="name"
              v-model="name"
              type="text"
              name="name"
              autocomplete="off"
              v-focus
              :placeholder="$text('home_new_game_name_placeholder')" />
          </div>

          <button class="mdi mdi-arrow-right"
            type="submit" />

        </div>

      </form>

    </transition>

  </card-list>

</div>
</template>

<script>
import ModalLayer from '../modal/ModalLayer'
import Modal from '../modal/Modal'
import CardList from '../common/CardList'
import storage from '../../game/storage/Storage'

export default {
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },

  components: {
    ModalLayer,
    CardList,
  },

  data: function() {
    return {
      name: null,
      newCareer: false,
      storage: storage,
      careerFileDragged: false,
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
          stars: career.getStarCount(),
          url: `c/${career.id}`
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
          this.$router.push({
            name: 'level-list',
            params: {
              careerID: career.id
            }
          })
        }
      }
      e.preventDefault()
    },

    handleClickOutside(e) {
      if (e.target === this.$el) {
        this.newCareer = false
      }
    },

    handleDragOver(e) {
      if (e.dataTransfer.types.includes("Files") && e.dataTransfer.items.length > 0) {
        e.dataTransfer.effectAllowed = "all"
        this.careerFileDragged = true
      }
      else {
        e.dataTransfer.effectAllowed = "none"
      }
    },

    handleDragLeave(e) {
      this.careerFileDragged = false
    },

    handleDrop(e) {
      this.careerFileDragged = false

      if (e.dataTransfer.types.includes("Files") && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        let file = e.dataTransfer.items[0].getAsFile()
        if (file.name.endsWith(".shsv")) {
          this.loadSavedCareer(file)
          return
        }
      }
      this.showWrongFormatFileModal()
    },

    saveCareer(careerID, e) {
      storage.saveCareer(careerID)
    },

    loadSavedCareer(file) {
      let reader = new FileReader()

      reader.onload = e => {
        let json = e.target.result

        try {
          storage.loadSavedCareer(json)
        }
        catch (ex) {
          console.error("Error while loading saved game from .shsv file", ex)
          this.showWrongFormatFileModal()
        }
      }
      reader.readAsText(file, "UTF-8")
    },

    showWrongFormatFileModal() {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'load-saved-career-error',
        props: {
          text: this.$text('home_wrong_file_format_error'),
          cancelable: false
        }
      })
    },

    deleteCareer(careerID, e) {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'remove-career-warning',
        props: {
          text: this.$text('home_remove_career_warning'),
          cancelable: true,
          confirmValue: careerID,
          confirmLabel: this.$text('modal_confirm_yes'),
          cancelLabel: this.$text('modal_cancel_no')
        },
        handlers: {
          confirm: this.confirmRemoveCareer
        }
      })
    },

    confirmRemoveCareer(careerID) {
      console.log("REMOVE career", careerID)
      storage.deleteCareer(careerID)
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';
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
    overflow: auto;

    header {
        background-image: url("../images/banner.jpg");
        width: 100%;
        max-height: calc(100vh - 420px);
        height: calc(calc(100vw - 80px) * 0.39);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-table;
    }

    .career-file-drop-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #222c;
        z-index: 10000;
        display: table;
        box-sizing: border-box;

        .career-file-drop-text {
            display: table-cell;
            text-align: center;
            vertical-align: middle;
            font-size: 35px;
            font-weight: 500;
            padding: 0 80px;
            text-shadow: 2px 2px 5px #222;
            white-space: pre;
        }
    }

    h1 {
        font-size: 60px;
        text-align: center;
        font-weight: 500;
        color: white;
        margin: 40px 0 20px;
    }

    button {
        background: none;
        border: none;
        outline: none;
        padding: 0;
        cursor: pointer;
    }

    .career-list {
        padding: 0 0 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        align-content: flex-start;
        margin: 0;
        height: max-content;

        .career-item {
            @include home-card($default-card-color);
            padding: 49px 30px 30px;
            display: flex;
            flex-direction: column;

            .buttons-container {
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                margin: 14px 12px;

                & > button {
                    width: 24px;
                    height: 24px;
                    color: white;
                    font-size: 24px;
                    line-height: 24px;
                    box-sizing: content-box;
                    padding: 0 4px;

                    transition: all 100ms ease;
                    opacity: 0.2;

                    &:hover {
                        opacity: 0.5;
                    }
                }
            }

            .career-name {
                width: 220px;
                height: 60px;
                text-align: center;
                font-weight: 500;
            }

            .stars-count {
                display: flex;
                margin-top: 55px;
                font-weight: 500;
                align-items: end;
                justify-content: center;

                .star-icon {
                    width: 100px;
                    height: 100px;
                    background-image: url("../images/star.png");
                    background-size: cover;
                    line-height: 100px;
                    text-align: center;

                    .number {
                        color: #394249;
                        font-style: normal;
                        text-align: center;
                        width: 60px;
                        font-size: 19px;
                        font-family: Digits, sans-serif;
                        vertical-align: middle;
                        margin-left: 4px;

                        &.small {
                            font-size: 16px;
                        }
                    }
                }
            }
        }

        .add-button-wrapper {
            @include card-box;
            border: dashed #ffffff1a 8px;
            display: flex;
            align-self: flex-start;
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
                    line-height: 40px;
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
