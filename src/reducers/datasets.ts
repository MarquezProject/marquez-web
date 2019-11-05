import { IDatasetAPI } from '../types/api'
import { findMatchingEntities } from './'
import { FETCH_DATASETS_SUCCESS, FIND_MATCHING_ENTITIES } from '../constants/ActionTypes'

export interface IDatasetsState {
  all: IDatasetAPI[]
  matching: IDatasetAPI[]
}

export const initialState: IDatasetsState = { all: [], matching: [] }

interface IDatasetsAction {
  type: string
  payload: {
    datasets?: IDatasetAPI[]
    search?: string
  }
}

export default (state: IDatasetsState = initialState, action: IDatasetsAction): IDatasetsState => {
  const { type, payload } = action

  switch (type) {
    case FETCH_DATASETS_SUCCESS:
      return { all: payload.datasets, matching: payload.datasets }
    case FIND_MATCHING_ENTITIES:
      return findMatchingEntities(payload.search, state) as IDatasetsState
    default:
      return state
  }
}
