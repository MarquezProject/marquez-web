import * as React from 'react'
import * as d3 from 'd3'

import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme
} from '@material-ui/core/styles'

import Legend from './Legend'

// import { createNetworkData } from '../helpers'
import { IDataset, IJob } from '../types/'

import { select } from 'd3-selection'
// import { tree } from 'd3-hierarchy'
// import { linkHorizontal } from 'd3-shape'

// import { forceCenter, forceLink, forceSimulation, forceManyBody, forceY } from 'd3-force'
import { zoom } from 'd3-zoom'
// import { color } from 'd3-color'
import Loader from './Loader'
// const globalStyles = require('../global_styles.css')
// const { jobNodeGrey, linkGrey, datasetNodeWhite } = globalStyles

// const fadedOut = (color(jobNodeGrey) as any).darker(1.7).toString()

const styles = ({ palette }: Theme) => {
  return createStyles({
    networkBackground: {
      background: palette.common.black,
      width: '100%',
      height: '50vh',
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      zIndex: 2
    },
    tooltip: {
      position: 'absolute',
      visibility: 'hidden',
      background: '#fff',
      color: palette.primary.main,
      zIndex: 3,
      padding: '5px 10px',
      font: '12px sans-serif',
      borderRadius: '2px',
      pointerEvents: 'none',
      opacity: 0.8
    },
    legend: {
      position: 'fixed',
      bottom: '59vh',
      right: '6%',
      zIndex: 3
    }
  })
}

interface IProps {
  jobs: IJob[]
  datasets: IDataset[]
  isLoading: boolean
}

type IAllProps = IWithStyles<typeof styles> & IProps

export class NetworkGraph extends React.Component<IAllProps, {}> {
  shouldComponentUpdate(newProps: IProps) {
    
    // const networkData = createNetworkData(newProps.datasets, newProps.jobs)
    // const { nodes, links } = networkData

    const svg: d3.Selection<SVGElement, void, HTMLElement, void> = select('#network-graph')

    if (svg.empty()) {
      return true
    }
    // const width = +svg.style('width').replace('px', '')
    // const height = +svg.style('height').replace('px', '')

    svg.call(
      zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', () => {
          svg.attr('transform', (event as any).transform)
        })
    )

    // const linkContainer: d3.Selection<SVGElement, void, HTMLElement, void> = svg.select('#links')

    

    // const tooltip = select('#tooltip')

    // datasetNodeSelection
    //   .on('mouseover', focus)
    //   .on('mousemove', move)
    //   .on('mouseout', unfocus)

    // function focus(d: INodeNetwork) {
    //   tooltip.text(d.id).style('visibility', 'visible')
    // }

    // function move() {
    //   return tooltip
    //     .style('top', (event as any).pageY - 10 + 'px')
    //     .style('left', (event as any).pageX + 10 + 'px')
    // }

    // function unfocus() {
    //   return tooltip.style('visibility', 'hidden')
    // }

    if (this.props.isLoading !== newProps.isLoading) {
      return true
    } else {
      return false
    }
  }

  graph: SVGElement

  render(): React.ReactElement {
    const { classes, isLoading } = this.props

    return (
      <div className={classes.networkBackground}>
        <div id='tooltip' className={classes.tooltip}></div>
        <Legend customClassName={classes.legend}></Legend>
        {isLoading ? (
          <Loader />
        ) : (
          <svg id='network-graph' className={classes.networkBackground}>
            <g
              ref={node => {
                this.graph = node as SVGElement
              }}
            >
            </g>
          </svg>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(NetworkGraph)
