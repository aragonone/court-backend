import * as ActionTypes from '../actions/types'

const initialState = { enabled: undefined, address: '', eth: {}, anj: {}, ant: {}, fee: {} }

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACCOUNT:
      return Object.assign({}, state, { address: action.address })
    case ActionTypes.RECEIVE_ETH_BALANCE:
      return Object.assign({}, state, { eth: { symbol: action.symbol, balance: action.balance }})
    case ActionTypes.RECEIVE_ANJ_BALANCE:
      return Object.assign({}, state, { anj: { symbol: action.symbol, balance: action.balance, address: action.address }})
    case ActionTypes.RECEIVE_ANT_BALANCE:
      return Object.assign({}, state, { ant: { symbol: action.symbol, balance: action.balance, address: action.address }})
    case ActionTypes.RECEIVE_FEE_BALANCE:
      return Object.assign({}, state, { fee: { symbol: action.symbol, balance: action.balance, address: action.address }})
    case ActionTypes.RECEIVE_WEB3_ENABLED:
      return Object.assign({}, state, { enabled: action.enabled })
    default:
      return state
  }
}

export default AccountsReducer
