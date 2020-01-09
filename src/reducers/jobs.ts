import { IJob } from '../types/'
import _find from 'lodash/find'
import { findMatchingEntities, filterEntities } from './'
import {
  FETCH_JOBS_SUCCESS,
  FIND_MATCHING_ENTITIES,
  FILTER_JOBS,
  FETCH_JOB_RUNS_SUCCESS,
  FETCH_JOB_RUNS
} from '../constants/ActionTypes'
import {
  fetchJobsSuccess,
  findMatchingEntities as findMatchingEntitiesActionCreator,
  filterJobs,
  fetchJobRunsSuccess
} from '../actionCreators'

export type IJobsState = IJob[]

export const initialState: IJobsState = []

type IJobsAction = ReturnType<typeof fetchJobsSuccess> &
  ReturnType<typeof findMatchingEntitiesActionCreator> &
  ReturnType<typeof filterJobs> &
  ReturnType<typeof fetchJobRunsSuccess>

export default (state = initialState, action: IJobsAction): IJobsState => {
  const { type, payload } = action

  switch (type) {
    case FETCH_JOBS_SUCCESS:
      return payload.jobs.map((j: IJob) => ({ ...j, matches: true }))
    case FIND_MATCHING_ENTITIES:
      return findMatchingEntities(payload.search, state) as IJobsState
    case FILTER_JOBS:
      return filterEntities(state, payload.filterByKey, payload.filterByValue)
    case FETCH_JOB_RUNS:
      console.log('FETCH JOB RUNS listener triggered')
      return state
    case FETCH_JOB_RUNS_SUCCESS: {
      console.log('FETCH JOB RUNS SUCCESS listener triggered')
      return state.map((j: IJob) => {
        const isMatching = j.name == payload.jobName
        const result = payload.lastTenJobRuns || ['this is a test']
        return isMatching ? { ...j, latestRuns: result } : j
      })
    }
    default:
      return state
  }
}
