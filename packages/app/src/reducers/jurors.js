import * as ActionTypes from '../actions/types'

const initialState = { module: null, list: [], current: {}, jurorDrafts: [], jurorAccounting: [] }

const JurorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_JURORS_LIST:
      return Object.assign({}, state, { list: action.list })
    case ActionTypes.RECEIVE_JUROR:
      return Object.assign({}, state, { current: action.juror })
    case ActionTypes.RECEIVE_JUROR_DRAFTS:
      return Object.assign({}, state, { jurorDrafts: action.jurorDrafts })
    case ActionTypes.RECEIVE_JUROR_STAKING:
      return Object.assign({}, state, { jurorsStaking: action.jurorsStaking })
    case ActionTypes.RECEIVE_JUROR_ACCOUNTING:
      return Object.assign({}, state, { jurorAccounting: action.jurorAccounting })
    case ActionTypes.RECEIVE_JURORS_MODULE:
      return Object.assign({}, state, { module: action.module })
    default:
      return state
  }
}

export default JurorsReducer
