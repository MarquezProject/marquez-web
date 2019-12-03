import { genericFetchWrapper } from '.'
import { IJobAPI, INamespaceAPI, IJobsAPI, IJobRunAPI } from '../types/api'

export const fetchJobs = async (namespace: INamespaceAPI) => {
  const { name } = namespace
  const url = `${__API_URL__}/namespaces/${name}/jobs?limit=700`
  return genericFetchWrapper<IJobAPI[]>(url, { method: 'GET' }, 'fetchJobs').then((r: IJobsAPI) => {
    return r.jobs.map(j => ({ ...j, namespace: namespace.name }))
  })
}

const tempJobRuns = [
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db90',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'NEW',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db90',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'FAILED',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db90',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'COMPLETED',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },

  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db92',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'COMPLETED',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },

  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db93',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'FAILED',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db93',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'NEW',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db93',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'ABORTED',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db92',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'RUNNING',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db91',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'RUNNING',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  },
  {
    runId: '870492da-ecfb-4be0-91b9-9a89ddd3db91',
    createdAt: '2019-05-09T19:49:24.201Z',
    updatedAt: '2019-05-09T19:49:24.201Z',
    nominalStartTime: '2019-05-12T19:49:24.201Z',
    nominalEndTime: '2019-05-12T19:52:24.201Z',
    runState: 'ABORTED',
    runArgs: {
      email: 'data@wework.com',
      emailOnFailure: false,
      emailOnRetry: true,
      retries: 2
    }
  }
]
export const fetchLatestJobRuns = async (_jobName: string, _namespaceName: string) => {
  // const url = `${__API_URL__}/namespaces/${namespaceName}/jobs/${jobName}/runs?limit=10`
  // return genericFetchWrapper<IJobRunAPI[]>(url, { method: 'GET' }, 'fetchLatestJobRuns')
  return { runs: tempJobRuns }
}
