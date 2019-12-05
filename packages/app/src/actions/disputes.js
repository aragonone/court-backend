import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const DisputeActions = {
  find(id) {
    return async function(dispatch) {
      try {
        dispatch(DisputeActions.receiveDispute({ id }))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAll() {
    return async function(dispatch) {
      try {
        dispatch(DisputeActions.receiveAll([ { id: 1 }]))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAll(list) {
    return { type: ActionTypes.RECEIVE_DISPUTES_LIST, list }
  },

  receiveDispute(investment) {
    return { type: ActionTypes.RECEIVE_DISPUTE, investment }
  },
}

export default DisputeActions
