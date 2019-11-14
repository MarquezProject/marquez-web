import { genericFetchWrapper } from '.'
import { IJobAPI, INamespaceAPI, IJobsAPI } from '../types/api'

export const fetchJobs = async (namespace: INamespaceAPI) => {
  const { name } = namespace
  const url = `${__API_URL__}/namespaces/${name}/jobs?limit=700`
  return genericFetchWrapper<IJobAPI[]>(url, { method: 'GET' }, 'fetchJobs').then((r: IJobsAPI) => {
    return r.jobs.map(j => ({ ...j, namespace: namespace.name }))
  })
}
