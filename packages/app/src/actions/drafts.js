import ErrorActions from './errors'
import Network from '../web3/Network'
import * as ActionTypes from '../actions/types'

const DraftActions = {
  find(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          jurorDraft (id: "${id}") {
            id
            weight
            rewarded
            commitment
            outcome
            leaker
            createdAt
            juror {
              id 
            }
            round {
              id
              number
              dispute {
                id
              }
            }
          }
        }`)
        dispatch(DraftActions.receiveDraft(result.jurorDraft))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAll() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          jurorDrafts {
            id
            weight
            rewarded
            commitment
            outcome
            leaker
            createdAt
            juror {
              id 
            }
            round {
              id
              number
              dispute {
                id
              }
            }
          }
        }`)
        dispatch(DraftActions.receiveAll(result.jurorDrafts))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAll(list) {
    return { type: ActionTypes.RECEIVE_DRAFTS_LIST, list }
  },

  receiveDraft(draft) {
    return { type: ActionTypes.RECEIVE_DRAFT, draft }
  },
}

export default DraftActions
