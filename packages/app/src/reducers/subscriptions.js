import * as ActionTypes from '../actions/types'

const initialState = { module: null, subscribers: [], periods: [], period: {} }

const SubscriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_SUBSCRIPTION_MODULE:
      return Object.assign({}, state, { module: action.module })
    case ActionTypes.RECEIVE_SUBSCRIPTION_PERIOD:
      return Object.assign({}, state, { period: action.period })
    case ActionTypes.RECEIVE_SUBSCRIPTION_PERIODS:
      return Object.assign({}, state, { periods: action.list })
    case ActionTypes.RECEIVE_SUBSCRIBERS:
      return Object.assign({}, state, { subscribers: action.list })
    default:
      return state
  }
}

export default SubscriptionsReducer
