<template>
<div class="line-numbers-container">
  <svg class="svg-defs">
    <defs>
      <g id="graph-cursor">
        <path d="M 26, 30 H 5.2 c -2.7, 0 -5 -2.3 -5 -5 V 5 c 0 -2.8, 2.3 -5, 5 -5 H 26 L 40,15 Z" />
      </g>

      <filter id="graph-cursor-dropshadow"
        width="150%"
        height="150%">
        <feGaussianBlur in="SourceAlpha"
          stdDeviation="3" />
        <feOffset dx="-1"
          dy="2"
          result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear"
            slope="0.8" />
          <feFuncB type="linear"
            slope="1"
            intercept="0.01" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>

  <ol class="line-numbers">

    <li v-for="number in numbers"
      class="line-number">{{ number }}</li>

  </ol>

  <ul class="cursors"
    v-show="playing">

    <li v-for="cursor in cursors"
      :key="cursor.heroIndex"
      :class="{
				'cursor': true,
				'selected': cursor.selected
			}"
      :style="{
				top: cursor.top + 'px',
				transform: `rotate(${cursor.rotate}deg)`
			}">
      <svg viewbox="0 0 60 60">
        <use x="10"
          y="13"
          href="#graph-cursor"
          filter="url(#graph-cursor-dropshadow)"
          @mousedown="$emit('select-follow-hero', cursor.heroIndex)"
          @touchstart="$emit('select-follow-hero', cursor.heroIndex)" />
      </svg>
    </li>

  </ul>

</div>
</template>

<script>
import IfStatement from '../../../world/ai/compile/statements/IfStatement'
import EndIfStatement from '../../../world/ai/compile/statements/EndIfStatement'
import AnchorStatement from '../../../world/ai/compile/statements/AnchorStatement'
import {
  lineMargin,
  lineHeight
}
from './nodes/NodeBuilder'

export default {
  props: {
    'statements': {
      type: Array
    },
    'playing': {
      type: Boolean
    },
    'debugContext': {
      type: Object
    },
    'followHeroIndex': {
      type: Number
    }
  },

  data: function() {
    return {
      followHeroCursorLine: 0
    }
  },

  watch: {
    debugContext: function() {
      this.updateFollowHeroCursorLine()
    },
    followHeroIndex: function() {
      this.updateFollowHeroCursorLine()
    }
  },

  computed: {
    numbers: function() {
      let lineNumbers = []
      let line = 1
      if (this.statements) {
        for (let statement of this.statements) {
          if (statement instanceof AnchorStatement) {
            lineNumbers.push(null)
          }
          else if (statement instanceof EndIfStatement) {
            continue
          }
          else {
            lineNumbers.push(line)
            line++

            // Insert empty lines for condition nodes
            if (statement instanceof IfStatement) {
              for (let i = 0; i < statement.condition.expressions.length - 1; i++) {
                lineNumbers.push(null)
              }

              // Insert line for empty if with else and empty if
              if ((statement.elseStatement && this.statements.indexOf(statement.elseStatement) - this.statements.indexOf(statement) === 1) ||
                this.statements.indexOf(statement.endIfStatement) - this.statements.indexOf(statement) === 1) {
                lineNumbers.push(null)
              }
            }
          }
        }
      }
      return lineNumbers
    },

    cursors: function() {
      if (!this.playing || !this.statements) {
        return []
      }

      let cursors = []
      let lineSet = []
      for (let i = 0; i < this.debugContext.heroes.length; i++) {
        let heroContext = this.debugContext.heroes[i]
        let line
        if (!heroContext.ended) {
          line = this.getStatementLine(this.statements[heroContext.cursor])
        }
        else {
          line = this.getLastLine()
        }

        let selected = i === this.followHeroIndex

        cursors.push({
          heroIndex: i,
          line: line,
          top: line * lineHeight,
          rotate: 0,
          selected: selected
        })

        if (!lineSet.includes(line)) {
          lineSet.push(line)
        }
      }


      // Space and rotation between the cursors
      // when there are more than one on the same line
      const maxSpaced = 5
      const maxHeight = 30
      const maxRotate = 20

      for (let line of lineSet) {
        let lineCursors = cursors.filter(cursor => cursor.line === line)
        if (lineCursors.length > 1) {
          let nbSpaced = Math.min(lineCursors.length, maxSpaced)

          for (let i = 0; i < lineCursors.length; i++) {
            let subIndex = i % nbSpaced
            let ratio = ((subIndex + 1) / (nbSpaced + 1)) - 0.5
            let cursor = lineCursors[i]
            cursor.top += ratio * maxHeight
            cursor.rotate = -ratio * maxRotate
          }
        }
      }

      return cursors
    }
  },

  methods: {
    getStatementLine(myStatement) {
      let line = 0

      for (let statement of this.statements) {
        if (statement === myStatement) {
          return line
        }

        if (!(statement instanceof EndIfStatement)) {
          line++

          // Insert empty lines for condition nodes
          if (statement instanceof IfStatement) {
            line += statement.condition.expressions.length - 1

            // Insert line for empty if with else and empty if
            if ((statement.elseStatement && this.statements.indexOf(statement.elseStatement) - this.statements.indexOf(statement) === 1) ||
              this.statements.indexOf(statement.endIfStatement) - this.statements.indexOf(statement) === 1) {
              line++
            }
          }
        }
      }
      return -1
    },

    getLastLine() {
      let line = 0

      for (let statement of this.statements) {

        if (!(statement instanceof EndIfStatement)) {
          line++

          // Insert empty lines for condition nodes
          if (statement instanceof IfStatement) {
            line += statement.condition.expressions.length - 1

            // Insert line for empty if with else and empty if
            if ((statement.elseStatement && this.statements.indexOf(statement.elseStatement) - this.statements.indexOf(statement) === 1) ||
              this.statements.indexOf(statement.endIfStatement) - this.statements.indexOf(statement) === 1) {
              line++
            }
          }
        }
      }
      return line
    },

    updateFollowHeroCursorLine() {
      let heroContext = this.debugContext.heroes[this.followHeroIndex]
      if (heroContext) {
        let cursor = this.debugContext.heroes[this.followHeroIndex].cursor
        let line = this.getStatementLine(this.statements[cursor])

        if (line !== this.followHeroCursorLine) {
          this.setFollowHeroCursorLine = line
          this.$emit('follow-hero-cursor-line-change', line)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../constants';

.svg-defs {
    position: absolute;
    width: 0;
    height: 0;
}

.line-numbers-container {
    position: relative;

    .line-numbers {
        width: 35px;
        padding: 10px 0 0;
        height: min-content;
        background-color: lighten(#282c34, 3%);

        li {
            @include no-select;
            text-align: center;
            margin: auto;
            font-weight: bold;
            font-size: 20px;
            color: lighten(#282c34, 10%);
            height: $node-line-height + $line-margin;
            line-height: 36px;
        }
    }

    .cursors {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        .cursor {
            position: absolute;
            width: 100px;
            left: -4px;

            transition-property: top, transform;
            transition-duration: 200ms;
            pointer-events: none;

            svg {
                height: 60px;
                width: 60px;
            }

            &.selected {
                z-index: 20;
                svg use {
                    fill: #5D84C7;
                }
            }

            svg use {
                transition: opacity 50ms ease;
                fill: lighten(#282c34, 10%);
                opacity: 0.8;
                pointer-events: fill;
            }

            &.selected svg use,
            svg use {
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
