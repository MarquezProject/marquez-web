import { createNetworkData } from '../../helpers'
const datasets = require('../../../docker/db/data/datasets.json')
const jobs = require('../../../docker/db/data/jobs.json')

describe('createNetworkData helper test', () => {
  it('should return an object with a nodes key and a links key', () => {
    const networkData = createNetworkData(datasets, jobs)
    expect(networkData).toHaveProperty('nodes')
    expect(networkData).toHaveProperty('links')
  })
  it('should return as many nodes as there are jobs + datasets', () => {
    const networkData = createNetworkData(datasets, jobs)
    expect(networkData.nodes).toHaveLength(datasets.length + jobs.length)
  })
  it("should return as many links as there are jobs' inputs & outputs", () => {
    const networkData = createNetworkData(datasets, jobs)
    const linkCount = jobs.reduce((links, job) => {
      return (links += job.inputs.length + job.outputs.length)
    }, 0)
    expect(networkData.links).toHaveLength(linkCount)
  })
})
