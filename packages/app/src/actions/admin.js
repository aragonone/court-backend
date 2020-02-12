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
      localStorage.removeItem('token')
      dispatch(AdminActions.resetAdmin())
      dispatch(AdminActions.resetToken())
    }
  },

  getCurrentAdmin() {
    return async function (dispatch) {
      if (localStorage.getItem('token')) {
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

  findSubscriptions() {
    return async function (dispatch) {
      try {
        const response = await Server.get('subscriptions')
        dispatch(AdminActions.receiveSubscriptions(response.data.subscriptions))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveToken(token) {
    localStorage.setItem('token', token)
    return { type: ActionTypes.RECEIVE_ADMIN_TOKEN, token }
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

  receiveSubscriptions(subscriptions) {
    return { type: ActionTypes.RECEIVE_ADMIN_SUBSCRIPTIONS, subscriptions }
  },
}

export default AdminActions
