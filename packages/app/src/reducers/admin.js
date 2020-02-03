import * as ActionTypes from '../actions/types'

const initialState = { id: null, email: null, token: null, admins: [], reveals: [], settlements: [], subscriptions: [], errors: [], error: {} }

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
    case ActionTypes.RECEIVE_ADMIN_REVEALS:
      return Object.assign({}, state, { reveals: action.reveals })
    case ActionTypes.RECEIVE_ADMIN_SETTLEMENTS:
      return Object.assign({}, state, { settlements: action.settlements })
    case ActionTypes.RECEIVE_ADMIN_SUBSCRIPTIONS:
      return Object.assign({}, state, { subscriptions: action.subscriptions })
    case ActionTypes.RECEIVE_ADMIN_ERRORS:
      return Object.assign({}, state, { errors: action.errors })
    case ActionTypes.RECEIVE_ADMIN_ERROR:
      return Object.assign({}, state, { error: action.error })
    default:
      return state
  }
}

export default AdminReducer
