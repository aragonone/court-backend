import * as ActionTypes from '../actions/types'

const initialState = { config: {} }

const CourtReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_COURT_CONFIG:
      return Object.assign({}, state, { config: action.config })
    default:
      return state
  }
}

export default CourtReducer
