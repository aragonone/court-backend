import * as ActionTypes from '../actions/types'

const initialState = { list: [], current: {} }

const DisputesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_DISPUTE:
      return Object.assign({}, state, { current: action.dispute })
    case ActionTypes.RECEIVE_DISPUTES_LIST:
      return Object.assign({}, state, { list: action.list })
    default:
      return state
  }
}

export default DisputesReducer
