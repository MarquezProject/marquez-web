import React from 'react'

import { Box, Theme } from '@material-ui/core'
import { DAGRE_CONFIG, INITIAL_TRANSFORM, NODE_SIZE } from './config'
import { GraphEdge, Node as GraphNode, graphlib, layout } from 'dagre'
import { HEADER_HEIGHT } from '../../helpers/theme'
import { IJob } from '../../types'
import { IState } from '../../reducers'
import { LineageGraph } from './types'
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import { Zoom } from '@visx/zoom'
import { connect } from 'react-redux'
import ParentSize from '@visx/responsive/lib/components/ParentSize'

const styles = (theme: Theme) => {
  return createStyles({
    lineageContainer: {
      marginTop: HEADER_HEIGHT,
      height: 800,
      borderBottom: `1px solid ${theme.palette.secondary.main}`
    }
  })
}

const MIN_ZOOM = 1 / 4
const MAX_ZOOM = 4

interface StateProps {
  jobs: IJob[]
}

interface LineageState {
  graph: graphlib.Graph<LineageGraph>
  edges: GraphEdge[]
  nodes: GraphNode<LineageGraph>[]
}

type LineageProps = WithStyles<typeof styles> & StateProps

let g: graphlib.Graph<LineageGraph>

class Lineage extends React.Component<LineageProps> {
  constructor(props: LineageProps) {
    super(props)
    this.state = {
      graph: g,
      edges: [],
      nodes: []
    }
  }

  componentDidUpdate(prevProps: Readonly<LineageProps>) {
    if (JSON.stringify(prevProps.jobs) !== JSON.stringify(this.props.jobs)) {
      this.initGraph()
      this.buildGraph()
    }
  }

  initGraph = () => {
    g = new graphlib.Graph<LineageGraph>({ directed: true })
    g.setGraph(DAGRE_CONFIG)
    g.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  buildGraph = () => {
    for (let i = 0; i < this.props.jobs.length; i++) {
      console.log(this.props.jobs[i])
      g.setNode(this.props.jobs[i].id.name, {
        ...this.props.jobs[i],
        width: NODE_SIZE,
        height: NODE_SIZE
      })
    }

    for (let i = 0; i < this.props.jobs.length; i++) {
      for (let j = 0; j < this.props.jobs[i].outputs.length; j++) {
        g.setEdge(this.props.jobs[i].id.name, this.props.jobs[i].outputs[j].name)
      }
    }
    layout(g)

    this.setState(
      {
        graph: g,
        edges: g.edges().map(e => g.edge(e)),
        nodes: g.nodes().map(v => g.node(v))
      },
      () => {
        console.log(this.state)
      }
    )
  }

  render() {
    const { classes } = this.props
    return (
      <Box className={classes.lineageContainer}>
        <ParentSize>
          {parent => (
            <Zoom
              width={parent.width}
              height={parent.height}
              scaleXMin={MIN_ZOOM}
              scaleXMax={MAX_ZOOM}
              scaleYMin={MIN_ZOOM}
              scaleYMax={MAX_ZOOM}
              transformMatrix={INITIAL_TRANSFORM}
            >
              {zoom => {
                return (
                  <Box position='relative'>
                    <svg
                      id={'GRAPH'}
                      width={parent.width}
                      height={parent.height}
                      style={{
                        cursor: zoom.isDragging ? 'grabbing' : 'grab'
                      }}
                    ></svg>
                  </Box>
                )
              }}
            </Zoom>
          )}
        </ParentSize>
      </Box>
    )
  }
}

const mapStateToProps = (state: IState) => ({
  jobs: state.jobs
})

export default withStyles(styles)(connect(mapStateToProps)(Lineage))
