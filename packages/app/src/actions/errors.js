import FetchingActions from './fetching'
import * as ActionTypes from '../actions/types'

const ErrorActions = {
  show(error, message = null) {
    console.error(error)
    return dispatch => {
      let text = message || error.message
      if (error.response && error.response.status === 400) text += `: ${JSON.stringify(error.response.data)}`

      dispatch({ type: ActionTypes.SHOW_ERROR, error: text })
      dispatch(FetchingActions.stop())
    }
  },

  reset() {
    return dispatch => dispatch({ type: ActionTypes.RESET_ERROR })
  }
}

export default ErrorActions
