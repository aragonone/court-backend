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
            feeAmount
            collectedFees
            jurorClaims {
              id
              juror { id }
              amount
            }
          }
        }`)

        const { subscriptionPeriod: period } = result
        dispatch(SubscriptionsActions.receivePeriod(period))

        const courtAddress = await CourtActions.findCourt()
        if (await Network.isCourtAt(courtAddress)) {
          const court = await Network.getCourt(courtAddress)
          const { balanceCheckpoint, totalActiveBalance } = await court.getPeriod(id)
          period.balanceCheckpoint = balanceCheckpoint
          period.totalActiveBalance = totalActiveBalance
        } else {
          period.balanceCheckpoint = 'cannot be fetched'
          period.totalActiveBalance = 'cannot be fetched'
        }

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
            feeAmount
            collectedFees
          }
        }`)

        const { subscriptionPeriods: periods } = result
        dispatch(SubscriptionsActions.receiveAllPeriods(periods))

        const courtAddress = await CourtActions.findCourt()
        if (await Network.isCourtAt(courtAddress)) {
          const court = await Network.getCourt(courtAddress)
          for (const period of periods) {
            const { balanceCheckpoint, totalActiveBalance } = await court.getPeriod(period.id)
            period.balanceCheckpoint = balanceCheckpoint
            period.totalActiveBalance = totalActiveBalance
            dispatch(SubscriptionsActions.receiveAllPeriods(periods))
          }
        } else {
          for (const period of periods) {
            period.balanceCheckpoint = 'cannot be fetched'
            period.totalActiveBalance = 'cannot be fetched'
          }
          dispatch(SubscriptionsActions.receiveAllPeriods(periods))
        }
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
