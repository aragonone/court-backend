const path = require('path')
const logger = require('@aragonone/court-backend-shared/helpers/logger')('config')

const command = 'config'
const describe = 'Call court hearbeat'

const builder = {
  config: { alias: 'c', describe: 'Config file, in the same format as in aragon-network-deploy repo', type: 'string' },
  term: { alias: 't', describe: 'First term id the config will be effective at', type: 'string' }
}

const handlerAsync = async (environment, { config: configFilename, term: fromTermId }) => {
  const config = require(path.resolve(process.cwd(), configFilename))

  const court = await environment.getCourt()

  if (!fromTermId) {
    fromTermId = await court.currentTerm()
  }

  const receipt = await court.instance.setConfig(
    fromTermId,                                    // fromTermId Identification number of the term in which the config will be effective at
    config.court.feeToken.address,                 // feeToken Address of the token contract that is used to pay for fees
    [
      config.court.jurorFee,                       // jurorFee Amount of fee tokens that is paid per juror per dispute
      config.court.draftFee,                       // draftFee Amount of fee tokens per juror to cover the drafting cost
      config.court.settleFee                       // settleFee Amount of fee tokens per juror to cover round settlement cost
    ],
    [
      config.court.evidenceTerms,                  // evidenceTerms Max submitting evidence period duration in terms
      config.court.commitTerms,                    // commitTerms Commit period duration in terms
      config.court.revealTerms,                    // revealTerms Reveal period duration in terms
      config.court.appealTerms,                    // appealTerms Appeal period duration in terms
      config.court.appealConfirmTerms              // appealConfirmationTerms Appeal confirmation period duration in terms
    ],
    [
      config.court.penaltyPct,                     // penaltyPct Permyriad of min active tokens balance to be locked for each drafted juror (‱ - 1/10,000)
      config.court.finalRoundReduction             // finalRoundReduction Permyriad of fee reduction for the last appeal round (‱ - 1/10,000)
    ],
    [
      config.court.firstRoundJurorsNumber,         // firstRoundJurorsNumber Number of jurors to be drafted for the first round of disputes
      config.court.appealStepFactor,               // appealStepFactor Increasing factor for the number of jurors of each round of a dispute
      config.court.maxRegularAppealRounds,         // maxRegularAppealRounds Number of regular appeal rounds before the final round is triggered
      config.court.finalRoundLockTerms             // finalRoundLockTerms Number of terms that a coherent juror in a final round is disallowed to withdraw (to prevent 51% attacks)
    ],
    [
      config.court.appealCollateralFactor,         // appealCollateralFactor Multiple of dispute fees required to appeal a preliminary ruling
      config.court.appealConfirmCollateralFactor   // appealConfirmCollateralFactor Multiple of dispute fees required to confirm appeal
    ],
    config.jurors.minActiveBalance                 // minActiveBalance Minimum amount of juror tokens that can be activated
  )
  logger.success(`Changed config in tx ${receipt.hash}`)
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
