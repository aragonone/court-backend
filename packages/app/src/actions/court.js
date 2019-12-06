import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const CourtActions = {
  findConfig() {
    return async function(dispatch) {
      try {
        const result = await Network.query(`{
          courtConfig(id: "${process.env.REACT_APP_COURT_ADDRESS}") {
            id
            termDuration
            currentTerm
            feeToken
            jurorFee
            draftFee
            settleFee
            evidenceTerms
            commitTerms
            revealTerms
            appealTerms
            appealConfirmationTerms
            penaltyPct
            finalRoundReduction
            firstRoundJurorsNumber
            appealStepFactor
            maxRegularAppealRounds
            finalRoundLockTerms
            appealCollateralFactor
            appealConfirmCollateralFactor
            minActiveBalance
            fundsGovernor
            configGovernor
            modulesGovernor
            modules {
              id
              address
            }
          }
        }`)

        const court = await Network.getCourt()
        const neededTransitions = await court.neededTransitions()
        const config = { ...result.courtConfig, neededTransitions }

        dispatch(CourtActions.receiveConfig(config))
      } catch(error) {
        dispatch(ErrorActions.show(error))
      }
    }
  },

  receiveConfig(config) {
    return { type: ActionTypes.RECEIVE_COURT_CONFIG, config }
  },
}

export default CourtActions
