import token from '../store/token'
import Server from '../web3/Server'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const AdminActions = {
  login(email, password) {
    return async function (dispatch) {
      try {
        const response = await Server.post('login', { email, password })
        dispatch(AdminActions.receiveToken(response.data.token))
        dispatch(AdminActions.getCurrentAdmin())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  logout() {
    return function (dispatch) {
      token.revoke()
      dispatch(AdminActions.resetAdmin())
      dispatch(AdminActions.resetToken())
    }
  },

  getCurrentAdmin() {
    return async function (dispatch) {
      if (token.exists()) {
        try {
          const response = await Server.get('me')
          dispatch(AdminActions.receiveAdmin(response.data.admin))
        } catch (error) {
          if (error.response && error.response.status === 403) dispatch(AdminActions.logout())
          else dispatch(ErrorActions.show(error))
        }
      }
    }
  },

  findAdmins() {
    return async function (dispatch) {
      try {
        const response = await Server.get('admins')
        dispatch(AdminActions.receiveAdmins(response.data.admins))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findReveals() {
    return async function (dispatch) {
      try {
        const response = await Server.get('reveals')
        dispatch(AdminActions.receiveReveals(response.data.reveals))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findUsers() {
    return async function (dispatch) {
      try {
        const response = await Server.get('users')
        dispatch(AdminActions.receiveUsers(response.data.users))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveToken(key) {
    token.set(key)
    return { type: ActionTypes.RECEIVE_ADMIN_TOKEN, token: key }
  },

  resetToken() {
    return { type: ActionTypes.RESET_ADMIN_TOKEN }
  },

  receiveAdmin(admin) {
    return { type: ActionTypes.RECEIVE_ADMIN, admin }
  },

  resetAdmin() {
    return { type: ActionTypes.RESET_ADMIN }
  },

  receiveAdmins(admins) {
    return { type: ActionTypes.RECEIVE_ADMIN_ADMINS, admins }
  },

  receiveReveals(reveals) {
    return { type: ActionTypes.RECEIVE_ADMIN_REVEALS, reveals }
  },

  receiveUsers(users) {
    return { type: ActionTypes.RECEIVE_ADMIN_USERS, users }
  },
}

export default AdminActions
