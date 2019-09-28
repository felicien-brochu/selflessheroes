<template>
<div class="level-details"
  @mousedown="handleClickOutside"
  @touchstart="handleClickOutside">

  <modal-layer ref="modalLayer" />

  <div class="level-details-modal">

    <div class="level-score">
      <div class="level-name">
        <score-stars :score="levelSolutions.score"
          :level="level" />

        <div class="level-label">{{$text(level.getNameMessageKey())}}</div>
      </div>

      <div class="score speed-score">
        <i class="mdi mdi-clock-fast" />
        <template v-if="levelSolutions.score.minStep >= 0">
          <span :class="{
				'score-number': true,
				'won': levelSolutions.score.minStep <= level.speedTarget
				}">{{levelSolutions.score.minStep}}</span><span class="score-target">/{{level.speedTarget}}</span>
        </template>
        <i v-else
          class="mdi mdi-infinity" />
      </div>
      <div class="score length-score">
        <i class="mdi mdi-format-list-numbered" />
        <template v-if="levelSolutions.score.minLength >= 0">
          <span :class="{
				'score-number': true,
				'won': levelSolutions.score.minLength <= level.lengthTarget
			}">{{levelSolutions.score.minLength}}</span><span class="score-target">/{{level.lengthTarget}}</span>
        </template>
        <i v-else
          class="mdi mdi-infinity" />
      </div>
    </div>

    <button class="close-button mdi mdi-close"
      type="button"
      :title="$text('modal_close_button')"
      @mousedown="$emit('close')"
      @touchstart="$emit('close')" />

    <div class="solution-table">
      <div class="solution-table-scroll">

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
                  @mousedown.stop.prevent="selectRenamedSolution(solution.id, solution.name, $event)"
                  @touchstart.stop.prevent="selectRenamedSolution(solution.id, solution.name, $event)" /><button type="button"
                  class="mdi mdi-content-copy"
                  :title="$text('level_details_duplicate_solution_button')"
                  @mousedown.stop.prevent="duplicateSolution(solution.id, $event)"
                  @touchstart.stop.prevent="duplicateSolution(solution.id, $event)" /><button v-if="solutions.length > 1"
                  type="button"
                  class="mdi mdi-delete"
                  :title="$text('level_details_delete_solution_button')"
                  @mousedown.stop.prevent="deleteSolution(solution.id, $event)"
                  @touchstart.stop.prevent="deleteSolution(solution.id, $event)" />

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
                :title="$text('level_details_edit_button_tooltip')"
                @mousedown="editLevelSolution"
                @touchstart="editLevelSolution" />
            </div>
          </li>
        </ul>
      </div>

      <button type="button"
        class="add-button mdi mdi-plus-circle"
        :title="$text('level_details_add_solution_button')"
        @mousedown.stop.prevent="createSolution"
        @touchstart.stop.prevent="createSolution" />

    </div>

    <div class="button-container">
      <button type="button"
        :title="$text('level_details_back_button_tooltip')"
        @mousedown="$emit('close')"
        @touchstart="$emit('close')"><i class="mdi mdi-chevron-left" />{{
				$text('level_details_back_button')
		}}</button>
      <button type="button"
        :title="$text('level_details_edit_button_tooltip')"
        @mousedown="editLevelSolution"
        @touchstart="editLevelSolution">{{
				$text('level_details_edit_button')
		}}<i class="mdi mdi-chevron-right" /></button>
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

      this.$el.style.position = 'absolute'
      this.$el.style.top = `${this.$el.parentNode.scrollTop}px`
    },

    createSolution(e) {
      let solution = this.levelSolutions.createDefaultSolution(this.level)
      this.renamedSolutionID = solution.id
      this.renamedSolutionName = solution.name
    },

    duplicateSolution(solutionID, e) {
      let solution = this.levelSolutions.duplicateSolution(solutionID, this.$text('level_details_duplicate_solution_suffix'))
      this.renamedSolutionID = solution.id
      this.renamedSolutionName = solution.name
    },

    deleteSolution(solutionID, e) {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'delete-solution-warning',
        props: {
          text: this.$text('level_details_delete_solution_warning'),
          cancelable: true,
          confirmValue: solutionID,
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
        max-height: calc(100vh - 60px);
        top: 30px;
        left: 50%;
        transform: translateX(-50%);

        font-family: 'Roboto', Arial, sans-serif;
        font-size: 20px;
        color: white;
        padding: 37px 50px 30px;
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

        .level-score {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            line-height: 37px;
            padding-right: 26px + 10px;
            margin-bottom: 16px;

            .level-name {
                display: flex;
                flex-grow: 1;
                .score-stars {
                    width: 64px;
                }

                .level-label {
                    font-weight: bold;
                    font-size: 30px;
                    margin-left: 10px;
                }
            }
        }

        .score {
            min-width: 130px;
            text-align: center;
            flex-shrink: 0;

            i {
                font-size: 24px;
                margin-right: 5px;
                opacity: 0.5;
            }

            .score-number {
                font-size: 24px;
                font-weight: 800;
                padding: 0 5px 0 0;

                &.won {
                    color: #86b36d;
                }
                &:not(.won) {
                    opacity: 0.8;
                }
            }

            .score-target {
                opacity: 0.5;
            }

            .mdi-infinity {
                opacity: 0.5;
            }
        }

        .solution-table {
            flex-grow: 1;
            display: flex;
            position: relative;
            min-height: 0;

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

            .solution-table-scroll {
                $table-color: #282C34;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                background-color: $table-color;
                min-height: 0;
                border-radius: 8px;
                overflow: auto;
                transform: translate(0);

                .solution-list {
                    $selected-color: #568AF2;
                    background-color: $table-color;
                    flex-grow: 1;
                    border-radius: 8px;
                    min-height: 250px;

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

                        &:last-child {
                            margin-bottom: 74px;
                        }

                        .score-stars {
                            width: 44px;
                            margin-right: 8px;
                            flex-shrink: 0;
                        }

                        .name-container {
                            display: flex;
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
            }
        }

        & > .button-container {
            min-width: 300px;
            display: flex;
            justify-content: space-evenly;
            margin-top: 24px;

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

                i {
                    vertical-align: middle;
                }

                &:first-child {
                    padding: 9px 20px 9px 12px;
                }
                &:last-child {
                    padding: 9px 12px 9px 20px;
                }
            }
        }
    }
}
</style>
