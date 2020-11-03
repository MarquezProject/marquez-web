import React from 'react'

import { Node as GraphNode } from 'dagre'
import { MqNode } from '../../types'
import { NodeText } from './NodeText'
import { Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/styles'

const styles = (theme: Theme) =>
  createStyles({
    pulseContainer: {
      overflow: 'visible'
    },
    pulse: {
      animation: '$pulseAnimation 3s linear infinite'
    },
    pulse1: {
      animation: '$pulseAnimation 3s linear infinite',
      animationDelay: '1s'
    },
    pulse2: {
      animation: '$pulseAnimation 3s linear infinite',
      animationDelay: '2s'
    },
    '@keyframes pulseAnimation': {
      '0%': {
        opacity: 0,
        transform: 'scale(0)'
      },
      '50%': {
        opacity: 0.1
      },
      '70%': {
        opacity: 0.09
      },
      '100%': {
        opacity: 0,
        transform: 'scale(15)'
      }
    }
  })

export type Vertex = {
  x: number
  y: number
}

const RADIUS = 14

interface NodeProps {
  node: GraphNode<MqNode>
}

class Node extends React.Component<NodeProps> {
  render() {
    const { node } = this.props
    return (
      <g>
        <circle cx={node.x} cy={node.y} r={RADIUS} fill={'white'} stroke={'white'} />
        <NodeText node={node} />
      </g>
    )
  }
}

export default Node
