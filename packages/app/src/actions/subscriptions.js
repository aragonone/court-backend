import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const SubscriptionsActions = {
  findPeriod(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          subscriptionPeriod (id: "${id}") {
            id
            feeToken
            feeAmount
            balanceCheckpoint
            totalActiveBalance
            collectedFees
            jurorClaims {
              id
              juror { id }
              amount
            }
          }
        }`)
        dispatch(SubscriptionsActions.receivePeriod(result.subscriptionPeriod))
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
            feeAmount
            balanceCheckpoint
            totalActiveBalance
            collectedFees
          }
        }`)
        dispatch(SubscriptionsActions.receiveAllPeriods(result.subscriptionPeriods))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAllSubscribers() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          subscribers {
            id
            subscribed
            paused
            lastPaymentPeriodId
            previousDelayedPeriods
          }
        }`)
        dispatch(SubscriptionsActions.receiveAllSubscribers(result.subscribers))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findModule() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          subscriptionModules (first: 1) {
            id
            currentPeriod
            feeAmount
            feeToken
            periodDuration
            prePaymentPeriods
            resumePrePaidPeriods
            latePaymentPenaltyPct
            governorSharePct
            totalPaid
            totalDonated
            totalCollected
            totalGovernorShares
          }
        }`)
        dispatch(SubscriptionsActions.receiveModule(result.subscriptionModules[0]))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAllSubscribers(list) {
    return { type: ActionTypes.RECEIVE_SUBSCRIBERS, list }
  },

  receiveAllPeriods(list) {
    return { type: ActionTypes.RECEIVE_SUBSCRIPTION_PERIODS, list }
  },

  receivePeriod(period) {
    return { type: ActionTypes.RECEIVE_SUBSCRIPTION_PERIOD, period }
  },

  receiveModule(module) {
    return { type: ActionTypes.RECEIVE_SUBSCRIPTION_MODULE, module }
  },
}

export default SubscriptionsActions
