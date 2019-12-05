import * as ActionTypes from '../actions/types'

const initialState = { address: '', eth: {}, anj: {}, fee: {} }

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACCOUNT:
      return Object.assign({}, state, { address: action.address })
    case ActionTypes.RECEIVE_ETH_BALANCE:
      return Object.assign({}, state, { eth: { symbol: action.symbol, balance: action.balance }})
    case ActionTypes.RECEIVE_ANJ_BALANCE:
      return Object.assign({}, state, { anj: { symbol: action.symbol, balance: action.balance }})
    case ActionTypes.RECEIVE_FEE_BALANCE:
      return Object.assign({}, state, { fee: { symbol: action.symbol, balance: action.balance }})
    default:
      return state
  }
}

export default AccountsReducer
