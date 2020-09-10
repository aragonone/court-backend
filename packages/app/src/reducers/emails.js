import * as ActionTypes from '../actions/types'

const initialState = { emailLogs: [] }

const EmailReducer = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.RECEIVE_EMAIL_LOG:
      const emailLogs = [...state.emailLogs, action.emailLog]
      return Object.assign({}, state, { emailLogs })
    case ActionTypes.RESET_EMAIL_LOGS:
      return Object.assign({}, state, { emailLogs: [] })
    case ActionTypes.RECEIVE_TEST_EMAIL_STATUS:
      return Object.assign({}, state, { testEmailSent: action.testEmailSent })
    default:
      return state
  }
}

export default EmailReducer
