import local from '../store/local'
import Server from '../web3/Server'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const AdminActions = {
  login(email, password) {
    return async function (dispatch) {
      try {
        const response = await Server.post('login', { email, password })
        dispatch(AdminActions.receiveAdmin({ id: response.data.id }))
        dispatch(AdminActions.getCurrentAdmin())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  logout() {
    return async function (dispatch) {
      try {
        await Server.post('logout')
        dispatch(AdminActions.resetAdmin())
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  getCurrentAdmin() {
    return async function (dispatch) {
      if (local.existsAdmin()) {
        try {
          const response = await Server.get('me')
          dispatch(AdminActions.receiveAdmin(response.data.admin))
        } catch (error) {
          if (error.response && error.response.status === 403) dispatch(AdminActions.resetAdmin())
          else dispatch(ErrorActions.show(error))
        }
      }
    }
  },

  findAdmins() {
    return async function (dispatch) {
      try {
        const response = await Server.get('admins')
        dispatch(AdminActions.receiveAdmins(response.data.results))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findReveals() {
    return async function (dispatch) {
      try {
        const response = await Server.get('reveals')
        dispatch(AdminActions.receiveReveals(response.data.results))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findUsers() {
    return async function (dispatch) {
      try {
        const response = await Server.get('users')
        dispatch(AdminActions.receiveUsers(response.data.results))
      } catch (error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAdmin(admin) {
    local.setAdmin(admin.id)
    return { type: ActionTypes.RECEIVE_ADMIN, admin }
  },

  resetAdmin() {
    local.unsetAdmin()
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
