import * as ActionTypes from '../actions/types'

const initialState = { list: [], current: {} }

const DraftsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_DRAFT:
      return Object.assign({}, state, { current: action.draft })
    case ActionTypes.RECEIVE_DRAFTS_LIST:
      return Object.assign({}, state, { list: action.list })
    default:
      return state
  }
}

export default DraftsReducer
