import { IDatasetAPI, IJobAPI, INetworkData, INodeNetwork } from '../types/api'

export const createRollbarMessage = (
  functionName: string,
  e: string,
  severity: 'critical' | 'error' | 'warning' | 'info' | 'debug' = 'error'
) => {
  if (__NODE_ENV__ === 'production') {
    if (__ROLLBAR__) {
      Rollbar[severity](`Error in ${functionName}: ${e}`)
    }
  }
}

export const createNetworkData = (datasets: IDatasetAPI[], jobs: IJobAPI[]): INetworkData => {
  console.log('jobs', jobs.length)
  console.log('What to do if there are matching jobs but no matching datasets?')
  const datasetNodes: INodeNetwork[] = datasets.map(d => ({
    id: d.name,
    tag: 'dataset'
  }))

  const jobNodes: INodeNetwork[] = jobs.map(j => ({
    id: j.name,
    tag: 'job'
  }))

  const links = jobs.reduce((links, singleJob) => {
    const inLinks = singleJob.inputs.map(input => ({
      source: input,
      target: singleJob.name
    }))
    const outLinks = singleJob.outputs.map(output => ({
      source: singleJob.name,
      target: output
    }))

    return [...links, ...inLinks, ...outLinks]
  }, [])
  return {
    nodes: [...datasetNodes, ...jobNodes],
    links
  }
}
