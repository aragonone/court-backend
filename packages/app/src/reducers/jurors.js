import * as ActionTypes from '../actions/types'

const initialState = { list: [], jurorDrafts: [], jurorAccounting: [] }

const JurorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_JURORS_LIST:
      return Object.assign({}, state, { list: action.list })
    case ActionTypes.RECEIVE_JUROR_DRAFTS:
      return Object.assign({}, state, { jurorDrafts: action.jurorDrafts })
    case ActionTypes.RECEIVE_JUROR_ACCOUNTING:
      return Object.assign({}, state, { jurorAccounting: action.jurorAccounting })
    default:
      return state
  }
}

export default JurorsReducer
