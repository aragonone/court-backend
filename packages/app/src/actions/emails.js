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
        for (let done, value; !done;) {
          ({ done, value } = await reader.read())
          dispatch(EmailActions.receveEmailLog(decoder.decode(value)))
        }
        dispatch(EmailActions.emailFormEnabled(true))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  resetEmailLogs(){
    return { type: ActionTypes.RESET_EMAIL_LOGS }
  },

  receveEmailLog(log) {
    return { type: ActionTypes.RECEIVE_EMAIL_LOG, log }
  },

  emailFormEnabled(enabled) {
    return { type: ActionTypes.RECEIVE_EMAIL_FORM_ENABLED, enabled }
  },
}

export default EmailActions
