import * as ActionTypes from '../actions/types'

const initialState = { balances: [], transfers: [] }

const ANJReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_BALANCES:
      return Object.assign({}, state, { balances: action.balances })
    case ActionTypes.RECEIVE_TRANSFERS:
      return Object.assign({}, state, { transfers: action.transfers })
    default:
      return state
  }
}

export default ANJReducer
