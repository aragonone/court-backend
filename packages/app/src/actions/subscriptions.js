import Network from '../web3/Network'
import ErrorActions from './errors'
import CourtActions from './court'
import * as ActionTypes from '../actions/types'

const SubscriptionsActions = {
  findPeriod(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          subscriptionPeriod (id: "${id}") {
            id
            feeToken
            collectedFees
            balanceCheckpoint
            totalActiveBalance
            accumulatedGovernorFees
            jurorClaims {
              id
              juror { id }
              amount
            }
          }
        }`)

        const { subscriptionPeriod: period } = result
        dispatch(SubscriptionsActions.receivePeriod(period))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAllPeriods() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          subscriptionPeriods (orderBy: createdAt, orderDirection: desc) {
            id
            feeToken
            collectedFees
            balanceCheckpoint
            totalActiveBalance
            accumulatedGovernorFees
            createdAt
          }
        }`)

        const { subscriptionPeriods: periods } = result
        dispatch(SubscriptionsActions.receiveAllPeriods(periods))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAllPeriods(list) {
    return { type: ActionTypes.RECEIVE_SUBSCRIPTION_PERIODS, list }
  },

  receivePeriod(period) {
    return { type: ActionTypes.RECEIVE_SUBSCRIPTION_PERIOD, period }
  },
}

export default SubscriptionsActions
