import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'
import Network from "../web3/Network";

const DisputeActions = {
  find(id) {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          dispute (id: "${id}") {
            id
            createTermId
            possibleRulings
            finalRuling
            lastRoundId
            state
            metadata
            createdAt
            subject {
              id
              evidence
            }
            rounds {
              state
              number
              draftTermId
              jurorsNumber
              settledPenalties
              jurorFees
              delayedTerms
              selectedJurors
              coherentJurors
              collectedTokens
              createdAt
              jurors {
                outcome
                commitment
                leaker
                weight
                rewarded
                createdAt
              }
              appeal {
                id
                maker
                appealedRuling
                taker
                opposedRuling
                settled
                createdAt
              }
            }
          }
        }`)
        dispatch(DisputeActions.receiveDispute(result.dispute))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  findAll() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          disputes {
            id
            createTermId
            possibleRulings
            finalRuling
            lastRoundId
            state
            metadata
            createdAt
            subject {
              id
            }
          }
        }`)
        dispatch(DisputeActions.receiveAll(result.disputes))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveAll(list) {
    return { type: ActionTypes.RECEIVE_DISPUTES_LIST, list }
  },

  receiveDispute(dispute) {
    return { type: ActionTypes.RECEIVE_DISPUTE, dispute }
  },
}

export default DisputeActions
