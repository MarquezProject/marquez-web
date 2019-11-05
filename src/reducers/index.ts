import { combineReducers, Reducer } from 'redux'
import { connectRouter } from 'connected-react-router'
import datasets, { IDatasetsState } from './datasets'
import jobs, { IJobsState } from './jobs'
import namespaces, { INamespacesState } from './namespaces'
import display, { IDisplayState } from './display'
import { History } from 'history'

export interface IState {
  datasets: IDatasetsState
  jobs: IJobsState
  namespaces: INamespacesState
  display: IDisplayState
}

export default (history: History): Reducer =>
  combineReducers({
    router: connectRouter(history),
    datasets,
    jobs,
    namespaces,
    display
  })

export function findMatchingEntities(
  payloadSearch: string,
  initialState: IJobsState | IDatasetsState
) {
  const searchString = payloadSearch.toLowerCase()
  const existingEntities = initialState.all as Array<any>
  const matchingEntities = existingEntities.filter(d => {
    return (
      d.name.toLowerCase().includes(searchString) ||
      (d.description || '').toLowerCase().includes(searchString)
    )
  })
  return { ...initialState, matching: matchingEntities }
}
