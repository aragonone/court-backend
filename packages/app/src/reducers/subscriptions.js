import * as ActionTypes from '../actions/types'

const initialState = { module: null, periods: [], period: {} }

const SubscriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_SUBSCRIPTION_MODULE:
      return Object.assign({}, state, { module: action.module })
    case ActionTypes.RECEIVE_SUBSCRIPTION_PERIOD:
      return Object.assign({}, state, { period: action.period })
    case ActionTypes.RECEIVE_SUBSCRIPTION_PERIODS:
      return Object.assign({}, state, { periods: action.list })
    default:
      return state
  }
}

export default SubscriptionsReducer
