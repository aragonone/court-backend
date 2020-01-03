import Network from '../web3/Network'
import ErrorActions from './errors'
import * as ActionTypes from '../actions/types'

const CourtActions = {
  async findCourt() {
    const result = await Network.query('{ courtConfigs { id } }')
    if (result.courtConfigs.length === 0) throw Error('Missing Aragon Court deployment')
    if (result.courtConfigs.length > 1) throw Error('Found more than Aragon Court deployment')
    return result.courtConfigs[0].id
  },

  findConfig() {
    return async function(dispatch) {
      try {
        const courtAddress = await CourtActions.findCourt()
        const result = await Network.query(`{
          courtConfig(id: "${courtAddress}") {
            id
            termDuration
            currentTerm
            feeToken {
              id 
              symbol
              name
              decimals
            }
            anjToken {
              id
              symbol
              name
              decimals 
            }
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
              type
            }
          }
        }`)

        let neededTransitions = '(cannot fetch info)'

        if (await Network.isEnabled()) {
          if (await Network.isCourtAt(courtAddress)) {
            const court = await Network.getCourt(courtAddress)
            neededTransitions = await court.neededTransitions()
          } else {
            dispatch(ErrorActions.show(new Error(`Could not find Court at ${courtAddress}, please make sure you're in the right network`)))
          }
        }

        const config = { ...result.courtConfig, neededTransitions, address: courtAddress }
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
