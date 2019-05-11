<template>
<div class="level-details"
  @mousedown="handleClickOutside"
  @touchstart="handleClickOutside">

  <modal-layer ref="modalLayer" />

  <div class="level-details-modal">

    <h2>{{level.name}}</h2>

    <button class="close-button mdi mdi-close"
      type="button"
      :title="$text('modal_close_button')"
      @mousedown="$emit('close')"
      @touchstart="$emit('close')" />

    <div class="solution-table">
      <div class="table-header">
        <i class="mdi mdi-clock-fast" />
        <i class="mdi mdi-format-list-numbered" />
      </div>

      <ul class="solution-list">
        <li v-for="solution in solutions"
          :key="solution.id"
          :class="{
					'selected': solution.id === levelSolutions.solutionID
				}"
          @mousedown="selectSolution(solution.id, $event)"
          @touchstart="selectSolution(solution.id, $event)">
          <score-stars :score="solution.score"
            :level="level" />

          <div class="name-container">

            <template v-if="renamedSolutionID !== solution.id">
              <span class="name">{{
						solution.name
					}}</span>

              <button type="button"
                class="mdi mdi-pencil"
                :title="$text('level_details_rename_solution_button')"
                @mousedown="selectRenamedSolution(solution.id, solution.name, $event)"
                @touchstart="selectRenamedSolution(solution.id, solution.name, $event)" /><button v-if="solutions.length > 1"
                type="button"
                class="mdi mdi-delete"
                :title="$text('level_details_delete_solution_button')"
                @mousedown="deleteSolution(solution.id, $event)"
                @touchstart="deleteSolution(solution.id, $event)" />

            </template>

            <form v-else
              @submit="renameSolution">
              <input v-focus
                type="text"
                name="name"
                v-model="renamedSolutionName"
                maxlength="20"
                :placeholder="$text('level_details_name_input_placeholder')"
                @blur="renameSolution" />
            </form>

          </div>

          <div class="score speed-score">
            <template v-if="solution.score.lastStep >= 0">
              <span :class="{
						'score-number': true,
						'won': solution.score.lastStep <= level.speedTarget
						}">{{solution.score.lastStep}}</span><span class="score-target">/{{level.speedTarget}}</span>
            </template>
            <i v-else
              class="mdi mdi-infinity" />
          </div>
          <div class="score length-score">
            <template v-if="solution.score.lastLength >= 0">
              <span :class="{
						'score-number': true,
						'won': solution.score.lastLength <= level.lengthTarget
					}">{{solution.score.lastLength}}</span><span class="score-target">/{{level.lengthTarget}}</span>
            </template>
            <i v-else
              class="mdi mdi-infinity" />
          </div>

          <div class="edit-button-container">
            <button v-if="solution.id === levelSolutions.solutionID"
              type="button"
              class="mdi mdi-arrow-right-circle"
              :title="$text('level_details_ok_button')"
              @mousedown="editLevelSolution"
              @touchstart="editLevelSolution" />
          </div>
        </li>
      </ul>


      <button type="button"
        class="add-button mdi mdi-plus-circle"
        :title="$text('level_details_add_solution_button')"
        @mousedown="createSolution"
        @touchstart="createSolution" />
    </div>

    <div class="button-container">
      <button type="button"
        :title="$text('level_details_ok_button')"
        @mousedown="editLevelSolution"
        @touchstart="editLevelSolution">{{
				$text('level_details_ok_button')
		}}</button>
    </div>
  </div>
</div>
</template>

<script>
import levelManager from '../../levels/levelManager'
import Modal from '../modal/Modal'
import ModalLayer from '../modal/ModalLayer'
import ScoreStars from './ScoreStars'

export default {
  components: {
    ScoreStars,
    ModalLayer
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  props: {
    'career': Object,
    'levelID': Number
  },

  data: function() {
    return {
      level: levelManager.getLevelByID(this.levelID),
      levelSolutions: this.career.getLevel(this.levelID),
      renamedSolutionID: -1,
      renamedSolutionName: ''
    }
  },

  computed: {
    solutions: function() {
      return this.levelSolutions.solutions.map(s => {
        return s.get()
      })
    }
  },

  methods: {
    selectSolution(id, e) {
      e.stopPropagation()
      this.levelSolutions.solutionID = id
      this.levelSolutions.save(false)
    },

    editLevelSolution() {
      this.$router.push({
        name: 'level',
        params: {
          careerID: this.career.id,
          levelID: this.levelID
        }
      })
    },

    createSolution() {
      let solution = this.levelSolutions.createDefaultSolution(this.level)
      this.renamedSolutionID = solution.id
      this.renamedSolutionName = solution.name
    },

    deleteSolution(id, e) {
      e.stopPropagation()

      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'delete-solution-warning',
        props: {
          text: this.$text('level_details_delete_solution_warning'),
          cancelable: true,
          confirmValue: id,
          confirmLabel: this.$text('modal_confirm_yes'),
          cancelLabel: this.$text('modal_cancel_no')
        },
        handlers: {
          confirm: this.confirmDeleteSolution
        }
      })
    },

    confirmDeleteSolution(id) {
      this.levelSolutions.deleteSolution(id)
    },

    selectRenamedSolution(solutionID, name, e) {
      e.stopPropagation()
      e.preventDefault()
      this.renamedSolutionID = solutionID
      this.renamedSolutionName = name
    },

    renameSolution(e) {
      let solution = this.levelSolutions.getSolution(this.renamedSolutionID)
      solution.name = this.renamedSolutionName
      solution.save()
      this.renamedSolutionID = -1
    },

    handleClickOutside(e) {
      if (e.target === this.$el) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss">
$level-details-color: #3C404A;

.level-details {
    position: relative;
    background-color: #282C34dd;

    .level-details-modal {
        position: absolute;
        width: calc(100vw - 80px);
        height: calc(100vh - 60px);
        top: 30px;
        left: 50%;
        transform: translateX(-50%);

        font-family: 'Roboto', Arial, sans-serif;
        font-size: 20px;
        color: white;
        padding: 47px 50px 30px;
        box-sizing: border-box;
        background: $level-details-color;
        border-radius: 12px;
        box-shadow: inset 0 0 30px 10px #00000033, 0 0 30px 10px #00000044;
        display: flex;
        flex-direction: column;
        max-width: 800px;

        button {
            margin: 0;
            background: none;
            outline: none;
            border: none;
            cursor: pointer;
            color: white;
        }

        h2 {
            margin: 0;
            font-size: 30px;
        }

        .close-button {
            position: absolute;
            top: 0;
            right: 0;
            margin: 14px 16px;
            width: 24px;
            height: 24px;
            color: white;
            font-size: 24px;
            line-height: 24px;
            padding: 0;
        }

        .solution-table {
            position: relative;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;

            .table-header {
                display: flex;
                padding: 0 10px + 26px;
                justify-content: flex-end;

                i {
                    width: 100px;
                    text-align: center;
                    font-size: 27px;
                }
            }

            .solution-list {
                $selected-color: #568AF2;
                $table-color: #282C34;
                background-color: $table-color;
                flex-grow: 1;
                border-radius: 8px;
                overflow: auto;

                li {
                    display: flex;
                    background: $table-color;
                    padding: 7px 10px;
                    line-height: 24px;

                    &.selected {
                        background-color: $selected-color;

                        &:nth-child(2n+1) {
                            background-color: $selected-color;
                        }

                        .score .score-number.won {
                            color: #54d20e;
                        }
                    }

                    &:nth-child(2n+1) {
                        background: lighten($table-color, 2%);
                    }

                    .score-stars {
                        width: 44px;
                        margin-right: 8px;
                        flex-shrink: 0;
                    }

                    .name-container {
                        flex-grow: 1;

                        .name {
                            vertical-align: middle;
                        }

                        button {
                            font-size: 18px;
                            opacity: 0.5;

                            &:active,
                            &:hover {
                                opacity: 1;
                            }

                            &::before {
                                vertical-align: middle;
                            }
                        }

                        input[type="text"] {
                            padding: 3px 6px;
                            border-radius: 5px;
                            font-family: 'Roboto', Arial, sans-serif;
                            font-size: 17px;
                            border: none;
                            background-color: white;
                            color: darken($selected-color, 10%);
                            width: 200px;
                        }
                    }

                    .score {
                        width: 100px;
                        text-align: center;
                        flex-shrink: 0;

                        .score-number {
                            font-size: 24px;
                            font-weight: 800;
                            padding: 0 5px 0 0;

                            &.won {
                                color: #86b36d;
                            }
                        }

                        .score-target {
                            opacity: 0.5;
                        }

                        .mdi-infinity {
                            opacity: 0.5;
                            padding: 0 30px;
                        }
                    }

                    .edit-button-container {
                        width: 26px;
                        button {
                            padding: 0;

                            &::before {
                                font-size: 22px;
                            }
                        }
                    }
                }
            }

            .add-button {
                position: absolute;
                bottom: 13px;
                right: 17px;
                font-size: 41px;
                text-shadow: 1px 0 10px 3px #000;

                &:active,
                &:hover {
                    text-shadow: 0 0 5px #fff4;
                }
            }
        }

        & > .button-container {
            min-width: 300px;
            display: flex;
            justify-content: space-evenly;
            margin-top: 35px;

            button {
                font-family: 'Roboto', Arial, sans-serif;
                font-weight: 500;
                min-width: 100px;
                font-size: 21px;
                padding: 9px 20px;
                background-color: lighten($level-details-color, 10%);
                color: white;
                border: none;
                border-radius: 3px;
                box-shadow: inset 0 0 10px 3px #0003, 0 0 10px 0 #0003;

                &:hover:not(:active) {
                    background-color: lighten($level-details-color, 12%);
                }
            }
        }
    }
}
</style>
