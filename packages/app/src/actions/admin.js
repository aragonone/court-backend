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

  findSettlements() {
    return async function (dispatch) {
      try {
        const response = await Server.get('settlements')
        dispatch(AdminActions.receiveSettlements(response.data.settlements))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findErrors() {
    return async function (dispatch) {
      try {
        const response = await Server.get('errors')
        dispatch(AdminActions.receiveErrors(response.data.errors))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findError(id) {
    return async function (dispatch) {
      try {
        const response = await Server.get(`errors/${id}`)
        dispatch(AdminActions.receiveError(response.data.error))
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

  receiveSettlements(settlements) {
    return { type: ActionTypes.RECEIVE_ADMIN_SETTLEMENTS, settlements }
  },

  receiveErrors(errors) {
    return { type: ActionTypes.RECEIVE_ADMIN_ERRORS, errors }
  },

  receiveError(error) {
    return { type: ActionTypes.RECEIVE_ADMIN_ERROR, error }
  }
}

export default AdminActions
