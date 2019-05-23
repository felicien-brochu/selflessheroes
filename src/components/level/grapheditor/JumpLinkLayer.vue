<template>
<svg class="jump-link-layer"
  width="100%"
  height="100%">

  <marker id="arrow"
    viewBox="0 0 10 10"
    refX="0"
    refY="5"
    markerWidth="3.5"
    markerHeight="3.5"
    orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" />
  </marker>

  <marker id="arrow-focused"
    viewBox="0 0 10 10"
    refX="0"
    refY="5"
    markerWidth="3.5"
    markerHeight="3.5"
    orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" />
  </marker>

  <path v-for="path in linkPaths"
    :class="{
			'link-line': true,
			'focused': path.focused
		}"
    :key="path.key"
    :d="path.path"
    :marker-end="`url(#arrow${path.focused ? '-focused' : ''})`" />
</svg>
</template>

<script>
import Vue from 'vue'
import _throttle from 'lodash.throttle'
import NodeBuilder from './nodes/NodeBuilder'
import AnchorStatement from '../../../world/ai/compile/statements/AnchorStatement'
import JumpStatement from '../../../world/ai/compile/statements/JumpStatement'

const arrowWidth = 16

export default {
  props: {
    focusedStatementIndex: {
      type: Number,
      default: -1
    }
  },
  data: function() {
    return {
      links: new Map(),
      linkPaths: []
    }
  },

  created() {
    this.updateLinkPaths = _throttle(this.updateLinkPaths, 10, {
      leading: true,
      trailing: true
    })
  },

  mounted() {
    this.graphCode = this.$parent
    this.graphCode.$on('nodes-change', this.handleNodesChange)
    this.graphCode.$on('scroll', this.updateLinkPaths)
    this.rsPane = this.$parent.$parent.$parent.$parent.$parent
    this.rsPane.$on('resize', this.updateLinkPaths)
    this.rsPane.$on('update:size', this.updateLinkPaths)
    window.addEventListener('resize', this.updateLinkPaths)
  },

  beforeDestroy() {
    this.graphCode.$off('nodes-change', this.handleNodesChange)
    this.graphCode.$off('scroll', this.updateLinkPaths)
    this.rsPane.$off('resize', this.updateLinkPaths)
    this.rsPane.$off('update:size', this.updateLinkPaths)
    window.removeEventListener('resize', this.updateLinkPaths)

    this.updateLinkPaths.cancel()
  },

  watch: {
    links: function(links) {
      this.updateLinkPaths()
    },
    focusedStatementIndex: function() {
      this.buildLinks()
    }
  },
  methods: {
    updateLinkPaths() {
      let paths = []
      for (let [
          jumpNode,
          target
        ] of this.links) {
        let anchorNode = target.anchor
        let jumpRect = jumpNode.$el.getBoundingClientRect()
        let anchorRect = anchorNode.$el.getBoundingClientRect()
        let jx = jumpRect.right
        let jy = jumpRect.top + (jumpRect.height / 2)
        let ax = anchorRect.right + arrowWidth
        let ay = anchorRect.top + (anchorRect.height / 2)
        let dx = 50 + Math.abs(ay - jy) / 5

        paths.push({
          key: anchorNode.statement.name,
          path: `M ${jx} ${jy} C ${jx + dx} ${jy}, ${ax + dx} ${ay}, ${ax} ${ay}`,
          focused: target.focused
        })
      }

      this.linkPaths = paths
    },

    handleDragOver(e) {
      this.updateLinkPaths()
    },

    handleNodesChange(newNodes, statements) {
      // Save nodes in a flat form
      newNodes = newNodes.slice(0)
      let nodes = []
      NodeBuilder.makeNodesIterable(newNodes)
      for (let node of newNodes) {
        nodes.push(node)
      }

      this.nodes = nodes
      this.statements = statements
      this.buildLinks()
    },

    buildLinks() {
      let links = new Map()
      let anchors = []
      let jumps = []

      for (let node of this.nodes) {
        if (node.statement instanceof JumpStatement) {
          jumps.push(node)
        }
        else if (node.statement instanceof AnchorStatement) {
          anchors.push(node)
        }
      }

      for (let jump of jumps) {
        for (let anchor of anchors) {
          if (anchor.statement === jump.statement.anchorStatement) {
            links.set(jump, {
              anchor: anchor,
              focused: this.statements.indexOf(jump.statement) === this.focusedStatementIndex ||
                this.statements.indexOf(anchor.statement) === this.focusedStatementIndex
            })
            break
          }
        }
      }

      this.links = links
    },

    clear() {
      let container = this.$el
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../mixins';

.jump-link-layer {
    width: 100%;
    height: 100%;
    pointer-events: none;

    .link-line {
        fill: none;
        stroke-width: 4px;
        stroke: transparentize(#666, 0.15);

        &.focused {
            stroke: transparentize($branching-color, 0.2);
        }
    }

    #arrow {
        stroke: none;
        fill: transparentize(#666, 0.15);
    }
    #arrow-focused {
        stroke: none;
        fill: transparentize($branching-color, 0.2);
    }
}

.disabled {
    display: none;
}
</style>
