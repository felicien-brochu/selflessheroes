<template>
<div class="level"
  v-hotkey="keymap">

  <modal-layer ref="modalLayer" />

  <world ref="world"
    :level="level"
    :followHeroIndex="followHeroIndex"
    @world-state-change="handleWorldStateChange"
    @ai-state-change="aiReady = $event"
    @ready="handleWorldReady"
    @follow-hero-change="followHeroIndex = $event" />

  <resize-split-pane id="rs-pane"
    split-to="columns"
    @resize="handleEditorResize"
    :allow-resize="true"
    :size="editorWidth"
    :min-size="320"
    :resizerThickness="2"
    units="pixels"
    resizerColor="#4b5261"
    primary="second">

    <div slot="firstPane"
      class="left-panel">

      <button class="back-button mdi mdi-chevron-left"
        type="button"
        :title="$text('level_back_button')"
        @mousedown="goBack"
        @touchstart="$event.preventDefault(); goBack()" />

      <button class="objective-button mdi mdi-flag-variant"
        type="button"
        :title="$text('level_objective_button')"
        @mousedown="showObjectiveModal"
        @touchstart="$event.preventDefault(); showObjectiveModal()" />

      <run-bar :worldReady="worldReady"
        :aiReady="aiReady"
        :worldState="worldState"
        @play-pause="handlePlayPause"
        @speed-change="setSpeed"
        @step="stepOnce"
        @stop="stop" />

    </div>

    <editor slot="secondPane"
      ref="editor"
      :code="code"
      :editorType="editorType"
      :codeSource="codeSource"
      :codeHistory="codeHistory"
      :compilerConfig="compilerConfig"
      :worldReady="worldReady"
      :playing="playing"
      :compilerExceptions="compilerExceptions"
      :debugContext="worldState.debugContext"
      :followHeroIndex="followHeroIndex"
      @undo="undo"
      @redo="redo"
      @code-change="handleCodeChange"
      @start-edit="handleStartEdit"
      @select-follow-hero="followHeroIndex = $event"
      @change-type="handleEditorTypeChange" />

  </resize-split-pane>
</div>
</template>

<script>
import _debounce from 'lodash.debounce'
import _throttle from 'lodash.throttle'
import World from './World'
import Editor from './Editor'
import RunBar from './runbar/RunBar'
import ResizeSplitPane from './rspane/ResizeSplitPane'
import ModalLayer from '../modal/ModalLayer'
import Modal from '../modal/Modal'
import WinModal from './winmodal/WinModal'
import ObjectiveModal from './ObjectiveModal'
import Compiler from '../../world/ai/compile/Compiler'
import Decompiler from '../../world/ai/compile/Decompiler'
import Linter from '../../world/ai/compile/Linter'
import storage from '../../game/storage/Storage'
import CodeHistory from '../../game/storage/CodeHistory'
import levelManager from '../../levels/levelManager'

export default {
  components: {
    World,
    Editor,
    RunBar,
    ResizeSplitPane,
    ModalLayer,
    WinModal
  },

  props: {
    careerID: {
      type: Number
    },
    levelID: {
      type: Number
    }
  },

  data: function() {
    let career = storage.get().getCareer(this.careerID)
    let levelSolutions = career.getLevel(this.levelID)
    let solution = levelSolutions.getCurrentSolution()

    return {
      code: solution.codeHistory.getCode(),
      codeSource: 'history',
      level: levelManager.getLevelByID(this.levelID),
      career: career,
      levelSolutions: levelSolutions,
      solution: solution,
      codeHistory: solution.codeHistory,
      editorType: solution.editorType,
      compilerConfig: null,
      worldState: {},
      worldReady: false,
      aiReady: false,
      followHeroIndex: -1,
      lossModalDisplayed: false,
      winModalDisplayed: false,
      compilerExceptions: {
        fatal: [],
        undefinedLiterals: []
      },
      editorWidth: 350
    }
  },

  beforeRouteEnter(to, from, next) {
    let career = storage.getCareer(Number(to.params.careerID))
    if (!career) {
      next({
        name: 'home'
      })
      return
    }
    let levelSolutions = career.getLevel(Number(to.params.levelID))
    if (!levelSolutions) {
      next({
        name: 'home'
      })
      return
    }
    next()
  },

  created() {
    this.debouncedSetWorldState = _throttle(this.setWorldState, 50, {
      leading: true,
      trailing: true
    })
    this.debouncedCompileCode = _debounce(this.compileCode, 250, {
      leading: true,
      trailing: true
    })
    this.debouncedPushHistory = _debounce(this.pushHistory, 1250, {
      leading: false,
      trailing: true
    })
  },

  mounted() {
    if (!this.solution.hasOpen) {
      this.showObjectiveModal()
      this.solution.hasOpen = true
      this.solution.save()
    }
  },

  beforeDestroy() {
    this.debouncedSetWorldState.flush()
    this.debouncedCompileCode.cancel()
    this.debouncedPushHistory.flush()
  },

  computed: {
    playing: function() {
      return this.worldReady && this.worldState && this.worldState.steps > 0
    },

    keymap: function() {
      return {
        'ctrl+z': this.undo,
        'ctrl+y': this.redo,
        'ctrl+shift+z': this.redo,
        'ctrl+space': this.togglePlayPause,
        'pause': this.pause,
        'ctrl+enter': this.stepOnce,
        'ctrl+s': function noop(e) {
          e.preventDefault()
        }
      }
    }
  },

  methods: {

    handleWorldReady(gameScene, worldState, compilerConfig) {
      this.gameScene = gameScene
      this.worldState = worldState
      this.compilerConfig = compilerConfig
      this.worldReady = true
      this.handleEditorResize(this.editorWidth)
      this.debouncedCompileCode()
    },

    handleWorldStateChange(worldState) {
      this.debouncedSetWorldState(worldState)
    },

    setWorldState(worldState) {
      this.worldState = worldState

      if (this.worldState.hasWon) {
        setTimeout(this.showWinModal.bind(this), 700)
      }
      else if (this.worldState.hasLost) {
        setTimeout(this.showLossModal.bind(this), 500)
      }
    },

    onTransitionAfterEnter() {
      this.$refs.world.onTransitionAfterEnter()
    },

    setCode(code, source, debounceCompile = true) {
      this.code = code
      this.codeSource = source

      this.handleStartEdit()

      if (debounceCompile) {
        this.debouncedCompileCode()
      }
      else {
        this.compileCode()
      }
    },

    showObjectiveModal() {
      this.$refs.modalLayer.addModal({
        component: ObjectiveModal,
        key: 'level_objective_modal',
        props: {
          level: this.level,
          solution: this.solution
        }
      })
    },

    showWinModal() {
      if (!this.winModalDisplayed) {
        this.winModalDisplayed = true

        this.$refs.modalLayer.addModal({
          component: WinModal,
          key: 'level_win_modal',
          props: {
            level: this.level,
            levelSolutions: this.levelSolutions,
            code: this.code
          },
          handlers: {
            confirm: (e) => this.handleWinModalClose('confirm', e),
            cancel: (e) => this.handleWinModalClose('cancel', e),
            'test-done': this.handleTestsDone
          }
        })
      }
    },

    handleTestsDone(e) {
      if (e.hasWon) {
        this.solution.addScore(e.averageStep, e.codeLength)
        this.levelSolutions.addScore(e.averageStep, e.codeLength)
      }
    },

    handleWinModalClose(action, e) {
      this.winModalDisplayed = false

      if (e.hasWon) {
        if (action === 'confirm') {
          this.goBack()
        }
      }
      else {
        let failedTest = e.tests.find(test => test.hasLost)
        this.$gameScene.restartWorldWithRngSeed(failedTest.rngSeed)
        this.showTestFailedModal()
      }
    },

    showTestFailedModal() {
      this.$refs.modalLayer.addModal({
        component: Modal,
        key: 'level_test_failed_modal',
        props: {
          text: this.$text('level_test_failed_modal'),
          cancelable: false
        }
      })
    },

    showLossModal() {
      if (!this.lossModalDisplayed) {
        const lossReason = this.level.getLossReasonTemplate(this.worldState.ruleset.getLossReason())
        this.lossModalDisplayed = true
        this.$refs.modalLayer.addModal({
          component: Modal,
          key: 'level_loss_modal',
          props: {
            text: lossReason,
            cancelable: false
          },
          handlers: {
            close: () => {
              this.lossModalDisplayed = false
            }
          }
        })
      }
    },

    undo() {
      if (this.codeHistory.canUndo()) {
        let code = this.codeHistory.undo()
        // For the graph editor the code must be compilable
        // Skip all uncompilable code
        if (this.editorType === 'graph') {
          while (this.codeHistory.canUndo()) {
            let compiler = new Compiler(code, this.compilerConfig)
            compiler.compile()

            if (compiler.exceptions.fatal.length === 0) {
              let statements = compiler.statements
              let hasCorrection = Linter.correctForGraph(statements, compiler.exceptions, this.compilerConfig)
              let decompiler = new Decompiler(statements, this.compilerConfig)
              decompiler.decompile()

              if (decompiler.code !== this.codeHistory.getCode(1)) {
                break
              }
            }
            code = this.codeHistory.undo()
          }
        }

        this.setCode(code, 'history')
        this.solution.save()
      }
    },

    redo() {
      if (this.codeHistory.canRedo()) {
        let code = this.codeHistory.redo()
        this.setCode(code, 'history')
        this.solution.save()
      }
    },

    pushHistory() {
      if (this.codeHistory.push(this.code)) {
        this.solution.save()
      }
    },

    insertHistoryCorrection() {
      if (this.codeHistory.insert(this.code)) {
        this.solution.save()
      }
    },

    handleCodeChange(code, source) {
      this.setCode(code, source)

      if (source === 'code') {
        this.debouncedPushHistory()
      }
      else if (source === 'graph-correction') {
        this.insertHistoryCorrection()
        this.solution.save()
      }
      else {
        this.pushHistory()
        this.solution.save()
      }
    },

    handleEditorTypeChange(editorType) {
      this.editorType = editorType
      this.solution.editorType = editorType
      this.solution.save()
    },


    handleStartEdit() {
      if (this.playing) {
        this.stop()
      }
    },

    handleEditorResize(editorWidth) {
      if (this.gameScene) {
        this.gameScene.handleEditorResize(editorWidth)
      }
    },

    handlePlayPause(play) {
      if (this.gameScene) {
        if (play) {
          this.play()
        }
        else {
          this.pause()
        }
      }
    },

    play() {
      if (this.gameScene) {
        this.gameScene.play()
      }
    },

    pause() {
      if (this.gameScene) {
        this.gameScene.pause()
      }
    },

    togglePlayPause() {
      if (this.gameScene) {
        this.gameScene.togglePlayPause()
      }
    },

    setSpeed(speed) {
      if (this.gameScene) {
        this.gameScene.setSpeed(speed)
      }
    },

    stepOnce() {
      if (this.gameScene) {
        this.gameScene.stepOnce()
      }
    },

    stop() {
      if (this.gameScene) {
        this.gameScene.stop()
      }
    },

    compileCode() {
      if (this.gameScene) {
        this.compilerExceptions = this.gameScene.compileAI(this.code)
      }
    },

    goBack() {
      this.$router.push({
        name: 'level-list',
        params: {
          careerID: this.career.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './mixins';

.level {
    @include no-select;
    margin: 0 auto;
    height: 100vh;

    #rs-pane {
        z-index: 5;
        pointer-events: none;

        & > * {
            pointer-events: all;
        }

        .Pane:first-child {
            pointer-events: none;

            .left-panel {
                position: relative;
                width: 100%;
                height: 100%;

                .back-button,
                .objective-button {
                    color: transparentize(white, 0.2);
                    background: none;
                    border: none;
                    outline: none;
                    pointer-events: all;
                    z-index: 5;
                    position: absolute;
                    padding: 0;
                    cursor: pointer;

                    &:hover {
                        color: white;
                    }
                }

                .back-button {
                    font-size: 60px;
                    line-height: 40px;
                    left: 4px;
                    top: 12px;
                }

                .objective-button {
                    font-size: 32px;
                    right: 14px;
                    top: 10px;
                }

                .run-bar {
                    pointer-events: all;
                    z-index: 5;
                    position: absolute;
                    width: 308px;
                    bottom: 20px;
                    margin-left: auto;
                    margin-right: auto;
                    left: 0;
                    right: 0;
                    box-shadow: 0 2px 8px 0 rgba(15, 17, 20, 0.7);
                }

                .win-modal {
                    pointer-events: all;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 50;

                    &.slide-down-enter-active {
                        transition: all 0.3s ease;
                    }

                    &.slide-down-leave-active {
                        transition: all 0.2s ease;
                    }

                    &.slide-down-enter,
                    &.slide-down-leave-to {
                        opacity: 0.5;
                        top: 0;
                        transform: translate(-50%, -100%);
                    }
                }
            }
        }
    }
}
</style>
