import { GraphEdge } from 'dagre'
import { LinePath } from '@visx/shape'
import { THEME_EXTRA } from '../../../../helpers/theme'
import { curveMonotoneX } from '@visx/curve'
import React from 'react'

type EdgeProps = {
  edgePoints: GraphEdge[]
}

class Edge extends React.Component<EdgeProps> {
  render() {
    const { edgePoints } = this.props
    return (
      <>
        {/* arrow definition for edges */}
        {edgePoints.map((edge, i) => {
          return (
            <LinePath<{ x: number; y: number }>
              key={i}
              curve={curveMonotoneX}
              data={edge.points}
              x={(d, index) => (index === 0 ? d.x + 20 : d.x - 25)}
              y={d => d.y}
              stroke={THEME_EXTRA.typography.subdued}
              strokeWidth={1}
              opacity={1}
              shapeRendering='geometricPrecision'
            />
          )
        })}
      </>
    )
  }
}

export default Edge
