export interface INetworkLink {
  offset: string
  source: string
  target: string
}

export interface INodeNetwork {
  id: string
  tag: 'dataset' | 'job'
}

export interface INetworkData {
  nodes: INodeNetwork[]
  links: INetworkLink[]
}

export interface IDatasetAPI {
  name: string
  createdAt: string
  updatedAt: string
  urn: string
  datasourceUrn: string
  description: string
  tags?: string[]
}

export interface INamespaceAPI {
  name: string
  createdAt: string // timestamp
  ownerName: string
  description: string
}

export interface IJobAPI {
  type: string
  name: string
  createdAt: string
  updatedAt: string
  inputs: string[] // array of dataset urns
  outputs: string[] // array of dataset urns
  location: string
  description: string
  status: 'failed' | 'passed'
}

export interface INamespacesAPI {
  namespaces: INamespaceAPI[]
}
export interface IDatasetsAPI {
  datasets: IDatasetAPI[]
}
export interface IJobsAPI {
  jobs: IJobAPI[]
}
