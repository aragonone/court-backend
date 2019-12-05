import * as ActionTypes from '../actions/types'

const ErrorsReducer = (state = null, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_ERROR:
      return action.error
    case ActionTypes.RESET_ERROR:
      return null
    default:
      return state
  }
}

export default ErrorsReducer
