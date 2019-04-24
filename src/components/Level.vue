<template>
<div class="level"
  v-hotkey="keymap">

  <world :levelID="levelID"
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
      <run-bar :worldReady="worldReady"
        :aiReady="aiReady"
        :worldState="worldState"
        @play-pause="handlePlayPause"
        @speed-change="setSpeed"
        @step="stepOnce"
        @stop="stop" />
    </div>

    <editor slot="secondPane"
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
import World from './level/World'
import Editor from './level/Editor'
import RunBar from './level/runbar/RunBar'
import ResizeSplitPane from './level/rspane/ResizeSplitPane'
import storage from '../game/storage/Storage'
import CodeHistory from '../game/storage/CodeHistory'

export default {
  components: {
    World,
    Editor,
    RunBar,
    ResizeSplitPane
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
    return {
      // code: 'b:\nstep(e)\na = dir(n)\n\nif b == 3 &&\n s > 3 ||\n n == wall:\n\tstep(e,w)\n\tstep(s)\n\tif n == wall:\n\t\tc:\n\t\tstep(sw)\n\tendif\nelse\n\ta = dir(sw)\n\tstep(n, s)\nendif\n\njump b\nstep(n)\nif n == wall:\n\t\tstep(nw)\n\tjump c\n\tendif\nstep(n)\nif n == s:\nendif\nstep(n)\nstep(n)\nstep(n)',
      // code: 'if s == s:\nelse\nif s == s:\nendif\nendif',
      code: '',
      codeSource: 'history',
      editorType: 'graph',
      codeHistory: new CodeHistory(),
      compilerConfig: null,
      worldState: {},
      worldReady: false,
      aiReady: false,
      followHeroIndex: -1,
      compilerExceptions: {
        fatal: [],
        undefinedLiterals: []
      },
      editorWidth: 360
    }
  },

  created() {
    this.loadSolution()

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
        'ctrl+shift+z': this.redo
      }
    }
  },

  methods: {
    loadSolution() {
      let career = storage.getCareer(this.careerID)
      if (!career) {
        this.$router.replace('/')
      }
      else {
        let level = career.getLevel(this.levelID)
        level = career.createLevel(this.levelID)
        if (!level) {
          this.$router.replace('/')
        }
        else {
          this.solution = level.getCurrentSolution()
          this.code = this.solution.codeHistory.getCode()
          this.codeHistory = this.solution.codeHistory
          this.editorType = this.solution.editorType
        }
      }
    },

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

    undo() {
      if (this.codeHistory.canUndo()) {
        let code = this.codeHistory.undo()
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
        this.gameScene.handlePlayPause(play)
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
    }
  }
}
</script>

<style lang="scss">
@import './level/constants';

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
            }
        }
    }
}
</style>
