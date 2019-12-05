import FetchingActions from './fetching'
import * as ActionTypes from '../actions/types'

const ErrorActions = {
  show(error, message = null) {
    console.error(error)
    return dispatch => {
      dispatch({ type: ActionTypes.SHOW_ERROR, error: (message || error.message) })
      dispatch(FetchingActions.stop())
    }
  },

  reset() {
    return dispatch => dispatch({ type: ActionTypes.RESET_ERROR })
  }
}

export default ErrorActions
