import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const ANJActions = {
  findBalances() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          anjbalances {
            id
            owner
            amount
          }
        }`)

        dispatch(ANJActions.receiveBalances(result.anjbalances))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findTransfers(account) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          anjtransfers(where: { from: "${account}" }, orderBy: createdAt, orderDirection: desc) {
            id
            from
            to
            amount
            createdAt
          }
        }`)
        dispatch(ANJActions.receiveTransfers(result.anjtransfers))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveBalances(balances) {
    return { type: ActionTypes.RECEIVE_BALANCES, balances }
  },

  receiveTransfers(transfers) {
    return { type: ActionTypes.RECEIVE_TRANSFERS, transfers }
  },
}

export default ANJActions
