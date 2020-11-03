import React from 'react'

import { Box, Theme } from '@material-ui/core'
import { DAGRE_CONFIG, INITIAL_TRANSFORM, NODE_SIZE } from './config'
import { GraphEdge, Node as GraphNode, graphlib, layout } from 'dagre'
import { HEADER_HEIGHT } from '../../helpers/theme'
import { IDataset, IJob } from '../../types'
import { IState } from '../../reducers'
import { LineageGraph } from './types'
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles'
import { Zoom } from '@visx/zoom'
import { connect } from 'react-redux'
import { localPoint } from '@visx/event'
import Edge from './components/edge/Edge'
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
const DOUBLE_CLICK_MAGNIFICATION = 1.1
const RADIUS = 14

interface StateProps {
  jobs: IJob[]
  datasets: IDataset[]
}

interface LineageState {
  graph: graphlib.Graph<LineageGraph>
  edges: GraphEdge[]
  nodes: GraphNode<LineageGraph>[]
}

type LineageProps = WithStyles<typeof styles> & StateProps

let g: graphlib.Graph<LineageGraph>

class Lineage extends React.Component<LineageProps, LineageState> {
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
      this.buildGraphNode()
      this.buildGraphAll()
    }
  }

  initGraph = () => {
    g = new graphlib.Graph<LineageGraph>({ directed: true })
    g.setGraph(DAGRE_CONFIG)
    g.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  buildGraphAll = () => {
    // jobs
    for (let i = 0; i < this.props.jobs.length; i++) {
      g.setNode(this.props.jobs[i].id.name, {
        ...this.props.jobs[i],
        width: NODE_SIZE,
        height: NODE_SIZE
      })
    }

    // datasets
    for (let i = 0; i < this.props.datasets.length; i++) {
      g.setNode(this.props.datasets[i].id.name, {
        ...this.props.jobs[i],
        width: NODE_SIZE,
        height: NODE_SIZE
      })
    }

    for (let i = 0; i < this.props.jobs.length; i++) {
      for (let j = 0; j < this.props.jobs[i].outputs.length; j++) {
        g.setEdge(this.props.jobs[i].id.name, this.props.jobs[i].outputs[j].name)
      }
      for (let j = 0; j < this.props.jobs[i].inputs.length; j++) {
        g.setEdge(this.props.jobs[i].inputs[j].name, this.props.jobs[i].id.name)
      }
    }
    layout(g)

    this.setState({
      graph: g,
      edges: g.edges().map(e => g.edge(e)),
      nodes: g.nodes().map(v => g.node(v))
    })
  }

  buildGraphNode = (node = 'delivery_times_7_days') => {
    const stack: (IJob | IDataset | undefined)[] = []
    const items: (IJob | IDataset | undefined)[] = []

    const job = this.props.jobs.find(job => job.name === node)
    if (job) {
      stack.push(job)
      items.push(job)
    }
    while (stack.length > 0) {
      const n = stack.pop()
      // job node
      if (n && 'outputs' in n) {
        const outputDatasets = n.outputs.map(output =>
          this.props.datasets.find(d => d.name === output.name)
        )
        const inputDatasets = n.inputs.map(output =>
          this.props.datasets.find(d => d.name === output.name)
        )
        const merged = [...inputDatasets, ...outputDatasets]
        const filtered = merged.filter(inputOrOutput => !items.includes(inputOrOutput))
        items.push(...filtered)
        stack.push(...filtered)
      }
      // dataset node
      else if (n && 'sourceName' in n) {
        const inputDatasets = this.props.jobs.filter(job => job.inputs.some(e => e.name === n.name))
        const outputDatasets = this.props.jobs.filter(job =>
          job.outputs.some(e => e.name === n.name)
        )
        const merged = [...inputDatasets, ...outputDatasets]
        const filtered = merged.filter(inputOrOutput => !items.includes(inputOrOutput))
        items.push(...filtered)
        stack.push(...filtered)
      }
    }
    return items
  }

  render() {
    const { classes } = this.props

    return (
      <Box className={classes.lineageContainer}>
        {this.state.graph && (
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
                      >
                        <g transform={zoom.toString()}>
                          {this.state.nodes.map((node, index) => {
                            if (node) {
                              return (
                                <circle
                                  key={index}
                                  cx={node.x}
                                  cy={node.y}
                                  r={RADIUS}
                                  fill={'white'}
                                  stroke={'white'}
                                />
                              )
                            } else return null
                          })}
                        </g>
                        <g transform={zoom.toString()}>
                          <Edge edgePoints={this.state.edges} />
                        </g>
                        <rect
                          width={parent.width}
                          height={parent.height}
                          fill={'transparent'}
                          onTouchStart={zoom.dragStart}
                          onTouchMove={zoom.dragMove}
                          onTouchEnd={zoom.dragEnd}
                          onMouseDown={event => {
                            zoom.dragStart(event)
                          }}
                          onMouseMove={zoom.dragMove}
                          onMouseUp={zoom.dragEnd}
                          onMouseLeave={() => {
                            if (zoom.isDragging) zoom.dragEnd()
                          }}
                          onDoubleClick={event => {
                            const point = localPoint(event) || {
                              x: 0,
                              y: 0
                            }
                            zoom.scale({
                              scaleX: DOUBLE_CLICK_MAGNIFICATION,
                              scaleY: DOUBLE_CLICK_MAGNIFICATION,
                              point
                            })
                          }}
                        />
                      </svg>
                    </Box>
                  )
                }}
              </Zoom>
            )}
          </ParentSize>
        )}
      </Box>
    )
  }
}

const mapStateToProps = (state: IState) => ({
  jobs: state.jobs,
  datasets: state.datasets
})

export default withStyles(styles)(connect(mapStateToProps)(Lineage))
