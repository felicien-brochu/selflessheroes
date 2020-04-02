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

  <div class="bottom-container">
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
          <button class="save-button mdi mdi-content-save-move"
            type="button"
            :title="$text('home_save_career_button')"
            @click.prevent="saveCareerFile(career.id, $event)"
            @touchstart.prevent="saveCareerFile(career.id, $event)" />

          <button class="remove-button mdi mdi-close"
            type="button"
            :title="$text('home_remove_career_button')"
            @click.prevent="deleteCareer(career.id, $event)"
            @touchstart.prevent="deleteCareer(career.id, $event)" />
        </div>

        <h3 class="career-name"
          v-text-fit="{
		      alignHoriz: true,
		      alignVert: true
		    }">{{
				career.name
			}}</h3>

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

        <li v-else
          class="career-item new-career-form">
          <form @submit.prevent="createCareer"
            action="/"
            method="post"
            key="new-career-form">

            <h3 v-text-fit="{
			      alignHoriz: true,
			      alignVert: true
			    }">{{$text('home_new_game')}}</h3>

            <div class="name-input-wrapper">

              <input id="new-career-name"
                v-model="newCareerName"
                type="text"
                name="newCareerName"
                autocomplete="off"
                v-focus
                :placeholder="$text('home_new_career_name_placeholder')" />

              <button class="mdi mdi-arrow-right"
                type="submit"
                :disabled="!newCareerName || newCareerName.length <= 0" />

            </div>
          </form>

          <div class="or-separator">{{$text('home_new_career_or_separator')}}</div>

          <form @submit.prevent=""
            class="load-career-form"
            action="/"
            method="post"
            key="load-career-form">

            <input id="saved-game-file"
              type="file"
              name="savedGameFile"
              accept=".shsv"
              @change="handleSavedGameFileChange" />
            <label for="saved-game-file"
              v-bbcode>{{$text('home_load_career_button')}}</label>

          </form>
        </li>

      </transition>

    </card-list>
  </div>

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
      newCareerName: null,
      newCareer: false,
      storage: storage,
      careerFileDragged: false,
    }
  },

  mounted() {
    this.$music.stopPlaylist()
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
      if (this.newCareerName && this.newCareerName.length > 0) {
        let career = storage.createCareer(this.newCareerName)
        if (career) {
          this.$router.push({
            name: 'level-list',
            params: {
              careerID: career.id
            }
          })
        }
      }
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
        this.$appRef.loadSavedCareerFile(file)
      }
      else {
        this.$appRef.showWrongFormatFileModal()
      }
    },

    handleSavedGameFileChange(e) {
      let file = e.target.files[0]
      this.$appRef.loadSavedCareerFile(file)
    },

    saveCareerFile(careerID, e) {
      storage.saveCareerFile(careerID)
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
    $list-background: #100B0F;

    background-image: url("../images/banner.jpg");
    background-position: center top;
    background-size: 120vw auto;
    background-repeat: no-repeat;
    background-attachment: local;
    background-color: $list-background;

    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    color: #ABB2BF;
    overflow: auto;

    @media screen and (max-width: 1280px) and (min-width: 860px) {
        background-size: 1280px auto;
    }
    @media screen and (max-width: 860px) {
        background-size: 149% auto;
        background-position: center top 40px;
    }

    header {
        display: inline-table;
        width: 100%;
        height: 31vw;

        @media screen and (max-width: 1280px) and (min-width: 860px) {
            height: 330px;
        }
        @media screen and (max-width: 860px) {
            height: calc(40px + 38vw);
        }
    }

    .career-file-drop-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(33,33,33,0.8);
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
        transition: opacity ease 500ms;

        &[disabled] {
            opacity: 0.3;
        }
    }

    .bottom-container {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 40px 60px;

        .career-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            align-content: flex-start;
            margin: auto;
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
                border: dashed rgba(254,254,254,0.1) 8px;
                display: flex;
                align-self: flex-start;
                align-items: center;
                justify-content: center;
                transition: background-color 0.4s, border-color 0.2s ease;
                cursor: pointer;

                button {
                    transition: opacity 0.3s ease;
                    opacity: 0.09;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 90px;
                }

                &:hover {
                    background-color: rgba(254, 254, 254, 0.1);
                    border-color: rgba(254, 254, 254, 0);
                    button {
                        opacity: 0.7;
                    }
                }
            }

            .new-career-form {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 30px;
                cursor: default;

                h3 {
                    font-family: 'Roboto', "Noto", Arial, sans-serif;
                    font-weight: 500;
                    margin: 0 auto 10px;
                    width: 200px;
                    height: 36px;
                    text-transform: capitalize;
                }

                .name-input-wrapper {
                    display: flex;
                    border-radius: 3px;
                    background-color: #353c4a;
                    flex-direction: row;
                    justify-content: start;

                    input[type=text] {
                        min-width: 0;
                        box-sizing: border-box;
                        font-size: 24px;
                        color: white;
                        font-weight: 500;
                        padding: 11px 0 11px 17px;
                        background: none;
                        font-family: inherit;
                        border: none;
                    }

                    button {
                        color: white;
                        font-size: 30px;
                        line-height: 40px;
                        padding: 0 9px 0 6px;
                        flex-shrink: 0;
                        flex-grow: 0;
                    }
                }

                .or-separator {
                    font-size: 30px;
                    font-weight: 500;
                    text-align: center;
                    margin: 20px 0;
                }

                .load-career-form {
                    margin: 0 auto;
                    max-width: 100%;

                    input {
                        display: none;
                    }

                    input + label {
                        text-align: center;
                        display: block;
                        width: 220px;
                        box-sizing: border-box;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 19px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        padding: 13px 18px;
                        border-radius: 3px;
                        box-shadow: inset 0 0 10px 3px rgba(0,0,0,0.2), 0 0 10px 0 rgba(0,0,0,0.2);
                        background-color: hsl(220, 18%, 29%);
                        color: #d4d4d4;

                        &:hover {
                            color: #e5e5e5;
                            background-color: hsl(220, 18%, 32%);
                        }

                        .mdi::before {
                            vertical-align: top;
                        }
                    }
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
