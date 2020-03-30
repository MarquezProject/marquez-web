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
import { hierarchy, tree } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'

import Loader from './Loader'

// import { zoom } from 'd3-zoom'
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
  history: any
}

type IAllProps = IWithStyles<typeof styles> & IProps

export class NetworkGraph extends React.Component<IAllProps, {}> {
  shouldComponentUpdate(newProps: IProps) {
    const { history } = newProps
    console.log('History: ', history)

    const svg: d3.Selection<SVGElement, void, HTMLElement, void> = select('#network-graph')

    if (svg.empty()) {
      return true
    }
    const height = +svg.style('height').replace('px', '')

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

    const circleHighlight = '#ffffff'
    const linkHighlight = '#b0b0b0'
    const defaultHighlight = '#575757'
    const labelHighlight = '#ffffff'
    const radius = 8
    const square = 13
    const strokeWidth = 5

    function graph(cluster: any, reverse: boolean) {
      
      cluster = tree().nodeSize([20, 70])(cluster)
      
      const g = svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('transform', `translate(${200}, ${height/2})`)
        
      g.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .selectAll('path')
        .data(cluster.links())
        .join('path')
        .attr('d', linkHorizontal().x((d: any) => reverse ? -d.y : d.y).y((d: any) => d.x))
        .attr('stroke', (d: any) => d.target.data.matches && d.source.data.matches ? linkHighlight : defaultHighlight)
      
      const datasets = _filter(cluster.descendants(), d => isDataset(d))
      const jobs = _filter(cluster.descendants(), d => !isDataset(d))
      
      const datasetNode = g.append('g')
        .attr('stroke-linejoin', 'round')
        .selectAll('g')
        .data(datasets)
        .join('g')
        .attr('transform', d => `translate(${reverse ? -d.y : d.y},${d.x})`)
    
      const jobNode = g
        .append('g')
        .attr('stroke-linejoin', 'round')
        .selectAll('g')
        .data(jobs)
        .join('g')
        .attr('transform', d => `translate(${reverse ? -d.y : d.y},${d.x})`)
        
      datasetNode
        .append('a')
        .attr('href', (d: any) => ('/datasets/' + d.data.name))
        .append('rect')
        .attr('fill', d => d.data.matches ? circleHighlight : defaultHighlight)
        .attr('x', -square/2)
        .attr('y', -square/2)
        .attr('width', square)
        .attr('height', square)
    
      jobNode
        .append('a')
        .attr('href', (d: any) => ('/jobs/' + d.data.name))
        .append('circle')
        .attr('fill', d => d.data.matches ? circleHighlight : defaultHighlight)
        .attr('r', radius)
      
      // Add text to nodes
      datasetNode.append('text')
        .text(d => d.data.matches ? d.data.name : null)
        .attr('dy', 10)
        .attr('font-size', 8)
        .attr('font-family', 'sans-serif')
        .attr('transform', `rotate(45) translate(${-(radius + 4)}, ${-radius})`)
        .attr('text-anchor', 'end')
        .attr('fill', labelHighlight)
      
      // Add text to nodes
      jobNode.append('text')
        .text(d => d.data.matches ? d.data.name : null)
        .attr('dy', 10)
        .attr('font-size', 8)
        .attr('font-family', 'sans-serif')
        .attr('transform', `rotate(45) translate(${-(radius + 4)}, ${-radius})`)
        .attr('text-anchor', 'end')
        .attr('fill', labelHighlight)
      
      // jobNode.on("mouseover", focus).on("mouseout", unfocus)
      // datasetNode.on("mouseover", focus).on("mouseout", unfocus)
      
      // function focus(d) {
      //   d3.select(this).attr('fill', d => circleHighlight)
      // }
      
      // function unfocus(d) {
      //   d3.select(this).attr('fill', d => isSearched(d.data.name) ? circleHighlight : defaultHighlight)
      // }
      
      return svg.node()
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
    
      graph(largestCluster, false)
      graph(reverseCluster, true)
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
 
export default (withStyles(styles)(NetworkGraph))