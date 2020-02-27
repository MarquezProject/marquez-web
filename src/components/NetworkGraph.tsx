import * as React from 'react'
import * as d3 from 'd3'

import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme
} from '@material-ui/core/styles'

import Legend from './Legend'

import { IDataset, IJob } from '../types/'

import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _flatten from 'lodash/flatten'
import _map from 'lodash/map'
import _sortBy from 'lodash/sortBy'

import { select } from 'd3-selection'
import { hierarchy } from 'd3-hierarchy'

// import { tree } from 'd3-hierarchy'
// import { linkHorizontal } from 'd3-shape'

import { zoom } from 'd3-zoom'
import Loader from './Loader'
// import { IDatasetAPI } from '../types/api'
// const globalStyles = require('../global_styles.css')
// const { jobNodeGrey, linkGrey, datasetNodeWhite } = globalStyles

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

    const isDataset = (node: any) => {
      const name = node.name || node.data.name
      return _find(newProps.datasets, d => d.name == name)
    }

    const findChildren = (node: any) => {
      let children
      if (isDataset(node)) {
        children = _filter(newProps.jobs, j => j.inputs.includes(node.name))
      } else {
        const job = _find(newProps.jobs, j => j.name == node.name)
        children = job ? _filter(newProps.datasets, d => job.outputs.includes(d.name) && !job.inputs.includes(d.name)) : []
      }
      return children
    }

    const findParents = (node: any) => {
      let parents
      if (isDataset(node)) {
        parents = _filter(newProps.jobs, j => j.outputs.includes(node.name))
      } else {
        const job = _find(newProps.jobs, j => j.name == node.name)
        parents = job ? _filter(newProps.datasets, j => job.inputs.includes(j.name) && !job.outputs.includes(j.name)) : []
      }
      return parents
    }

    const getLineages = () => {
      const searchedDatasets = _filter(newProps.datasets, d => d.matches)
      const searchedJobs = _filter(newProps.jobs, j => j.matches)
      const allNodes = [...searchedDatasets, ...searchedJobs]
      
      const lineages = _map(allNodes, (rootNode: any) => {
        rootNode.children = findChildren(rootNode)
        let children = rootNode.children
        while (children.length > 0) {
          _map(children, child => {
            child.children = findChildren(child)
          })
          children = _flatten(_map(children, chi => chi.children))
        }
        return rootNode
      })
      return lineages
    }

    const getReverseLineage = (node: any) => {
      node.children = findParents(node)
      let children = node.children
      while (children.length > 0) {
        _map(children, child => {
          child.children = findParents(child)
        })
        children = _flatten(_map(children, chi => chi.children))
      }
      return node
    }

    // run calculations for network graph
    const lineages = getLineages()
    let clusters = _map(lineages, lineage => hierarchy(lineage))
    clusters = _sortBy(clusters, l => l.descendants().length)
    const largestCluster = clusters[clusters.length - 1]
    if (largestCluster) {
      const rootNode = largestCluster.data
      const reverseLineage = getReverseLineage(rootNode)
      const reverseCluster = hierarchy(reverseLineage)
    
      // remove svg elements
      svg.selectAll('*').remove()
    
      // graph(largestCluster, false)
      // graph(reverseCluster, true)
      console.log(largestCluster)
      console.log(reverseCluster)
    }

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
