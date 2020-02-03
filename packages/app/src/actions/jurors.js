import ErrorActions from './errors'
import Network from '../web3/Network'
import * as ActionTypes from '../actions/types'

const JurorsActions = {
  find(address) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          juror (id: "${address}") {
            treeId
            id
            activeBalance
            lockedBalance
            availableBalance
            deactivationBalance
            withdrawalsLockTermId
            createdAt
          }
        }`)
        dispatch(JurorsActions.receiveJuror(result.juror))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAll() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          jurors (orderBy: createdAt, orderDirection: asc) {
            treeId
            id
            activeBalance
            lockedBalance
            availableBalance
            deactivationBalance
            createdAt
          }
        }`)
        dispatch(JurorsActions.receiveAll(result.jurors))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findDrafts(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          juror (id: "${id}") {
            treeId
            id
            drafts {
              id
              weight
              rewarded
              commitment
              outcome
              leaker
              createdAt
              round {
                id
                number
                dispute {
                  id
                }
              }
            }
          }
        }`)
        dispatch(JurorsActions.receiveJurorDrafts(result.juror.drafts))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAccounting(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          juror (id: "${id}") {
            treeId
            id
            movements (orderBy: createdAt, orderDirection: desc) {
              id
              type
              amount
              effectiveTermId
              createdAt
            }
          }
        }`)
        dispatch(JurorsActions.receiveJurorAccounting(result.juror.movements))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveJuror(juror) {
    return { type: ActionTypes.RECEIVE_JUROR, juror }
  },

  receiveAll(list) {
    return { type: ActionTypes.RECEIVE_JURORS_LIST, list }
  },

  receiveJurorDrafts(jurorDrafts) {
    return { type: ActionTypes.RECEIVE_JUROR_DRAFTS, jurorDrafts }
  },

  receiveJurorAccounting(jurorAccounting) {
    return { type: ActionTypes.RECEIVE_JUROR_ACCOUNTING, jurorAccounting }
  },
}

export default JurorsActions
