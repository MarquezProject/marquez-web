import { Nullable } from '../types/util/Nullable'
import { SET_SELECTED_NODE } from '../constants/ActionTypes'

interface ISetSelectedNodeAction {
  type: string
  payload: string
}

export interface ILineageState {
  selectedNode: Nullable<string>
}

const initialState: ILineageState = {
  selectedNode: null
}

export default (state = initialState, action: ISetSelectedNodeAction) => {
  switch (action.type) {
    case SET_SELECTED_NODE:
      return { ...state, selectedNode: action.payload }
    default:
      return state
  }
}
