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
          jurors (first: 1000, orderBy: createdAt, orderDirection: asc) {
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

  findStaking(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          juror (id: "${id}") {
            treeId
            id
            anjMovements (orderBy: createdAt, orderDirection: desc) {
              id
              type
              amount
              effectiveTermId
              createdAt
            }
          }
        }`)
        dispatch(JurorsActions.receiveJurorStaking(result.juror.anjMovements))
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
            feeMovements (orderBy: createdAt, orderDirection: desc) {
              id
              type
              amount
              createdAt
            }
          }
        }`)
        dispatch(JurorsActions.receiveJurorAccounting(result.juror.feeMovements))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findModule() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          jurorsRegistryModules (first: 1) {
            id
            totalStaked
            totalActive
          }
        }`)
        dispatch(JurorsActions.receiveModule(result.jurorsRegistryModules[0]))
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

  receiveJurorStaking(jurorStaking) {
    return { type: ActionTypes.RECEIVE_JUROR_STAKING, jurorStaking }
  },

  receiveJurorAccounting(jurorAccounting) {
    return { type: ActionTypes.RECEIVE_JUROR_ACCOUNTING, jurorAccounting }
  },

  receiveModule(module) {
    return { type: ActionTypes.RECEIVE_JURORS_MODULE, module }
  },
}

export default JurorsActions
