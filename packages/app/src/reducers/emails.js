import * as ActionTypes from '../actions/types'

const initialState = { emailLogs: [] }

const EmailReducer = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.RECEIVE_EMAIL_LOG:
      const emailLogs = [...state.emailLogs, action.log]
      return Object.assign({}, state, { emailLogs })
    case ActionTypes.RESET_EMAIL_LOGS:
      return Object.assign({}, state, { emailLogs: [] })
    case ActionTypes.RECEIVE_EMAIL_FORM_ENABLED:
      return Object.assign({}, state, { enabled: action.enabled })
    default:
      return state
  }
}

export default EmailReducer
