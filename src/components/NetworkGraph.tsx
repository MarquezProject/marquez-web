import * as React from 'react'
import * as d3 from 'd3'
import {
  withStyles,
  createStyles,
  WithStyles as IWithStyles,
  Theme
} from '@material-ui/core/styles'
import { createNetworkData } from '../helpers'
import { IDatasetAPI, IJobAPI, INodeNetwork, INetworkLink } from '../types/api'
import { select } from 'd3-selection'
import { forceCenter, forceLink, forceSimulation, forceManyBody, forceX, forceY } from 'd3-force'
import { zoom } from 'd3-zoom'

const width = 960
const height = 350

const styles = ({ palette }: Theme) => {
  return createStyles({
    networkBackground: {
      background: palette.primary.main,
      width: '100%',
      height: '50vh'
    },
    tooltip: {
      position: 'absolute',
      visibility: 'hidden',
      background: '#fff',
      color: palette.primary.main,
      zIndex: 10,
      padding: '5px 10px',
      font: '12px sans-serif',
      borderRadius: '2px',
      pointerEvents: 'none',
      opacity: 0.8
    }
  })
}

interface IProps {
  matchingJobs: IJobAPI[]
  matchingDatasets: IDatasetAPI[]
}

type IAllProps = IWithStyles<typeof styles> & IProps

class NetworkGraph extends React.Component<IAllProps, {}> {
  shouldComponentUpdate(newProps: IProps) {
    type IDatumCombined = INodeNetwork & d3.SimulationNodeDatum
    const networkData = createNetworkData(newProps.matchingDatasets, newProps.matchingJobs)
    const { nodes, links } = networkData

    const svg: d3.Selection<SVGElement, void, HTMLElement, void> = select('#network-graph')

    forceSimulation<IDatumCombined, INetworkLink>(nodes)
      .force('charge', forceManyBody().strength(-30))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX(width / 2))
      .force('y', forceY(height / 2))
      .force(
        'link',
        forceLink(links).id((d: any) => {
          return d.id
        })
      )
      .on('tick', ticked)

    // const adjacent = []

    // data.links.forEach(d => {
    //   adjacent[d.source.index + '-' + d.target.index] = true
    //   adjacent[d.target.index + '-' + d.source.index] = true
    // })

    // const neighbor = (a, b) => {
    //   return a == b || adjacent[a + '-' + b]
    // }

    svg.call(
      zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', () => {
          svg.attr('transform', (event as any).transform)
          console.log('am I zooming?')
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
            .style('stroke', '#aaa')
            .style('stroke-width', 1),
        update => update,
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
            .append('circle')
            .attr('class', 'jobNode')
            .attr('r', 5)
            .attr('fill', '#fff'),
        update => update,
        exit => exit.remove()
      )

    const datasetNodeContainer: d3.Selection<SVGElement, void, HTMLElement, void> = svg.select(
      '#datasetNodes'
    )

    const datasetNodeSelection = datasetNodeContainer
      .selectAll('.datasetNode')
      .data(
        nodes.filter((d: any) => {
          return d.tag == 'dataset'
        }),
        (d: any) => d.id
      )
      .join(
        enter => {
          console.log('enter', enter)
          return enter
            .append('rect')
            .attr('class', 'datasetNode')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#7d7d7d')
        },
        update => update,
        exit => {
          console.log('exit', exit)
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
      link
        .attr('x1', function(d) {
          return d.source.x
        })
        .attr('y1', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.source.y
        })
        .attr('x2', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.target.x
        })
        .attr('y2', function(d: INetworkLink & d3.SimulationLinkDatum<any>) {
          return d.target.y
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
    return false
  }

  graph: SVGElement

  render(): React.ReactElement {
    const { classes } = this.props
    const { tooltip, networkBackground } = classes
    return (
      <div>
        <div id='tooltip' className={tooltip}></div>
        <svg id='network-graph' className={networkBackground}>
          <g
            ref={node => {
              this.graph = node
            }}
          >
            <g id='links'></g>
            <g id='jobNodes'></g>
            <g id='datasetNodes'></g>
          </g>
        </svg>
      </div>
    )
  }
}

export default withStyles(styles)(NetworkGraph)
