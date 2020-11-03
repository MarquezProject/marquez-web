import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GraphEdge, Node as GraphNode } from 'dagre'
import { MqNode } from '../../types'
import { NodeText } from './NodeText'
import { Theme } from '@material-ui/core'
import { createStyles } from '@material-ui/styles'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { theme } from '../../../../helpers/theme'

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
const OUTER_RADIUS = RADIUS + 8
const ICON_SIZE = 16
const BORDER = 2

interface NodeProps {
  node: GraphNode<MqNode>
  edgeEnds: Vertex[]
}

class Node extends React.Component<NodeProps> {
  render() {
    const { node, edgeEnds } = this.props
    return (
      <g>
        {edgeEnds.find(edge => edge.x === node.x && edge.y === node.y) && (
          <FontAwesomeIcon
            icon={faCaretRight}
            x={node.x - OUTER_RADIUS - ICON_SIZE / 2}
            y={node.y - ICON_SIZE / 2}
            width={ICON_SIZE}
            height={ICON_SIZE}
            color={theme.palette.secondary.main}
          />
        )}
        <circle cx={node.x} cy={node.y} r={RADIUS} fill={'white'} stroke={'white'} />
        <NodeText node={node} />
      </g>
    )
  }
}

export default Node
