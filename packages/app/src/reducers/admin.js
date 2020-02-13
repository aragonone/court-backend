import * as ActionTypes from '../actions/types'

const initialState = { id: null, email: null, token: null, admins: [], users: [], reveals: [] }

const AdminReducer = (state = initialState, action) => {
  switch(action.type) {
    case ActionTypes.RESET_ADMIN_TOKEN:
      return Object.assign({}, state, { token: null })
    case ActionTypes.RECEIVE_ADMIN_TOKEN:
      return Object.assign({}, state, { token: action.token })
    case ActionTypes.RESET_ADMIN:
      return Object.assign({}, state, { id: null, email: null })
    case ActionTypes.RECEIVE_ADMIN:
      return Object.assign({}, state, { ...action.admin })
    case ActionTypes.RECEIVE_ADMIN_ADMINS:
      return Object.assign({}, state, { admins: action.admins })
    case ActionTypes.RECEIVE_ADMIN_USERS:
      return Object.assign({}, state, { users: action.users })
    case ActionTypes.RECEIVE_ADMIN_REVEALS:
      return Object.assign({}, state, { reveals: action.reveals })
    default:
      return state
  }
}

export default AdminReducer
