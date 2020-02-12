import * as ActionTypes from '../actions/types'

const initialState = { address: undefined, anj: {}, ant: {}, fee: {} }

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_FAUCET:
      return Object.assign({}, state, { address: action.address })
    case ActionTypes.RECEIVE_FAUCET_ANJ_BALANCE:
      return Object.assign({}, state, { anj: { symbol: action.symbol, balance: action.balance, address: action.address, period: action.period, quota: action.quota }})
    case ActionTypes.RECEIVE_FAUCET_ANT_BALANCE:
      return Object.assign({}, state, { ant: { symbol: action.symbol, balance: action.balance, address: action.address, period: action.period, quota: action.quota }})
    case ActionTypes.RECEIVE_FAUCET_FEE_BALANCE:
      return Object.assign({}, state, { fee: { symbol: action.symbol, balance: action.balance, address: action.address, period: action.period, quota: action.quota }})
    default:
      return state
  }
}

export default AccountsReducer
