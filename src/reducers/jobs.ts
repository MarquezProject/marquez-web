import { IJobAPI } from '../types/api'
import { findMatchingEntities } from './'
import { FETCH_JOBS_SUCCESS, FIND_MATCHING_ENTITIES } from '../constants/ActionTypes'

export interface IJobsState {
  all: IJobAPI[]
  matching: IJobAPI[]
}

const initialState: IJobsState = { all: [], matching: [] }

interface IJobsAction {
  type: string
  payload: {
    jobs: IJobAPI[]
    search?: string
  }
}

export default (state = initialState, action: IJobsAction) => {
  const { type, payload } = action

  switch (type) {
    case FETCH_JOBS_SUCCESS:
      return { all: payload.jobs, matching: payload.jobs }
    case FIND_MATCHING_ENTITIES:
      return findMatchingEntities(payload.search, state) as IJobsState
    default:
      return state
  }
}
