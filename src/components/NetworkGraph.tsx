import * as React from 'react'
import * as d3 from 'd3'
import {
  Link
} from 'react-router-dom'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme
} from '@material-ui/core/styles'

import Legend from './Legend'

import { createNetworkData } from '../helpers'
import { IDataset, IJob, INodeNetwork, INetworkLink } from '../types/'
import { select } from 'd3-selection'
import { forceCenter, forceLink, forceSimulation, forceManyBody, forceY } from 'd3-force'
import { zoom } from 'd3-zoom'
import { color } from 'd3-color'
import Loader from './Loader'
const globalStyles = require('../global_styles.css')
const { jobNodeGrey, linkGrey, datasetNodeWhite } = globalStyles

const fadedOut = (color(jobNodeGrey) as any).darker(1.7).toString()

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
    type IDatumCombined = INodeNetwork & d3.SimulationNodeDatum
    const networkData = createNetworkData(newProps.datasets, newProps.jobs)
    const { nodes, links } = networkData

    const svg: d3.Selection<SVGElement, void, HTMLElement, void> = select('#network-graph')

    if (svg.empty()) {
      return true
    }
    const width = +svg.style('width').replace('px', '')
    const height = +svg.style('height').replace('px', '')

    const graphLayout = forceSimulation<IDatumCombined, INetworkLink>(nodes)
      .force('charge', forceManyBody().strength(-50))
      .force('center', forceCenter(width / 2, height / 2))
      .alpha(.2)
      .force('y', forceY(height / 2))
      .force(
        'link',
        forceLink(links).id((d: any) => {
          return d.id
        })
      )
      .on('tick', ticked)

    svg.call(
      zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', () => {
          svg.attr('transform', (event as any).transform)
        })
    )

    const linkContainer: d3.Selection<SVGElement, void, HTMLElement, void> = svg.select('#links')

    const linkSelection = linkContainer
      .selectAll('.link')
      .data(links, (l: INetworkLink) => l.source + l.target)
      .join(
        enter =>
          enter
            .append('line')
            .attr('class', 'link')
            .style('stroke', l => (l.connectsToMatchingNode ? linkGrey : fadedOut))
            .style('stroke-width', 2),
        update => update.style('stroke', l => (l.connectsToMatchingNode ? linkGrey : fadedOut)),
        exit => exit.remove()
      )

    const jobNodeContainer: d3.Selection<SVGElement, void, HTMLElement, void> = svg.select(
      '#jobNodes'
    )

    const jobNodeSelection = jobNodeContainer
      .selectAll('.jobNode')
      .data(
        nodes.filter((d: IDatumCombined) => {
          return d.tag == 'job'
        }),
        (j: any) => j.id
      )
      .join(
        enter =>
          enter
            .append("a")
            .attr("href", d => ("/jobs/" + d.id))
            .append('circle')
            .attr('class', 'jobNode')
            .attr('r', 5)
            .attr('fill', n => (n.matches ? jobNodeGrey : fadedOut)),
        update => update
          .attr('fill', n => (n.matches ? jobNodeGrey : fadedOut)),
        exit => exit.remove()
      )

    const datasetNodeContainer: d3.Selection<SVGElement, void, HTMLElement, void> = svg.select(
      '#datasetNodes'
    )

    const datasetNodeDimension = 10
    const datasetNodeSelection = datasetNodeContainer
      .selectAll('.datasetNode')
      .data(
        nodes.filter((d: any) => {
          return d.tag == 'dataset'
        }),
        (d: any) => d.id
      )
      .join(
        enter =>
          enter
            .append("a")
            .attr("href", d => ("/datasets/" + d.id))
            .append('rect')
            .attr('class', 'datasetNode')
            .attr('width', datasetNodeDimension)
            .attr('height', datasetNodeDimension)
            .attr('fill', n => (n.matches ? datasetNodeWhite : fadedOut)),
        update => update.attr('fill', n => (n.matches ? datasetNodeWhite : fadedOut)),
        exit => {
          return exit.remove()
        }
      )

    function ticked() {
      jobNodeSelection.call(updateNode)

      datasetNodeSelection.call(updateNode)

      linkSelection.call(updateLink)
    }

    const tooltip = select('#tooltip')

    datasetNodeSelection
      .on('mouseover', focus)
      .on('mousemove', move)
      .on('mouseout', unfocus)

    jobNodeSelection
      .on('mouseover', focus)
      .on('mousemove', move)
      .on('mouseout', unfocus)

    function focus(d: INodeNetwork) {
      tooltip.text(d.id).style('visibility', 'visible')
    }

    function move() {
      return tooltip
        .style('top', (event as any).pageY - 10 + 'px')
        .style('left', (event as any).pageX + 10 + 'px')
    }

    function unfocus() {
      return tooltip.style('visibility', 'hidden')
    }

    function updateLink(link: d3.Selection<SVGElement, any, any, any>) {
      const k = 6 * graphLayout.alpha()
      link
        .each(function(d) {
          d.source.x -= k * 7, d.target.x += k * 4
        })
        .attr('x1', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.offset == 'source' ? d.source.x + datasetNodeDimension / 2 : d.source.x
        })
        .attr('y1', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.offset == 'source' ? d.source.y + datasetNodeDimension / 2 : d.source.y
        })
        .attr('x2', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.offset == 'target' ? d.target.x + datasetNodeDimension / 2 : d.target.x
        })
        .attr('y2', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.offset == 'target' ? d.target.y + datasetNodeDimension / 2 : d.target.y
        })
    }

    function updateNode() {
      jobNodeSelection.attr('transform', (d: any) => {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
      datasetNodeSelection.attr('transform', (d: any) => {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
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

    const { tooltip, networkBackground } = classes
    return (
      <div className={networkBackground}>
        <div id='tooltip' className={tooltip}></div>
        <Legend customClassName={classes.legend}></Legend>
        {isLoading ? (
          <Loader />
        ) : (
          <svg id='network-graph' className={networkBackground}>
            <g
              ref={node => {
                this.graph = node as SVGElement
              }}
            >
              <g id='links'></g>
              <g id='jobNodes'></g>
              <g id='datasetNodes'></g>
            </g>
          </svg>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(NetworkGraph)
