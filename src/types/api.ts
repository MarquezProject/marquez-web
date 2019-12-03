interface IFieldsAPI {
  name: string
  type: string
}

export interface IDatasetAPI {
  name: string
  createdAt: string
  updatedAt: string
  urn: string
  sourceName: string
  description: string
  tags?: string[]
  fields?: IFieldsAPI[]
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
  context: {
    SQL: string
  }
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
