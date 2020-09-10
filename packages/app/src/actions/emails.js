import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

const EmailActions = {

  sendEmails(params) {
    return async function (dispatch) {
      try {
        const decoder = new TextDecoder('utf-8')
        const response = await fetch(`${SERVER_URL}/emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(params),
        })
        const reader = response.body.getReader()
        for (;;) {
          const { done, value } = await reader.read()
          dispatch(EmailActions.receveEmailLog(decoder.decode(value)))
          if (done) {
            dispatch(EmailActions.testEmailSent(true))
            break
          }
        }
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  resetEmailLogs(){
    return { type: ActionTypes.RESET_EMAIL_LOGS }
  },

  receveEmailLog(emailLog) {
    return { type: ActionTypes.RECEIVE_EMAIL_LOG, emailLog }
  },

  testEmailSent(testEmailSent) {
    return { type: ActionTypes.RECEIVE_TEST_EMAIL_STATUS, testEmailSent }
  },
}

export default EmailActions
