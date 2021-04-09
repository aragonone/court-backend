const logger = require('../helpers/logger')('Court')
const { bn, bigExp } = require('../helpers/numbers')
const { decodeEventsOfType } = require('@1hive/celeste/test/helpers/lib/decodeEvent')
const { encodeVoteId, hashVote } = require('../helpers/voting')
const { DISPUTE_MANAGER_EVENTS } = require('@1hive/celeste/test/helpers/utils/events')
const { DISPUTE_MANAGER_ERRORS } = require('@1hive/celeste/test/helpers/utils/errors')
const { getEventArgument, getEvents } = require('@aragon/test-helpers/events')
const { sha3, fromWei, utf8ToHex, soliditySha3, padLeft, toHex } = require('web3-utils')

const ROUND_STATE_ENDED = 5
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

module.exports = class {
  constructor(instance, environment) {
    this.instance = instance
    this.environment = environment
  }

  async anj() {
    if (!this._anj) {
      const registry = await this.registry()
      const address = await registry.token()
      const MiniMeToken = await this.environment.getArtifact('MiniMeToken', '@aragon/minime')
      this._anj = await MiniMeToken.at(address)
    }
    return this._anj
  }

  async feeToken() {
    if (!this._feeToken) {
      const { feeToken } = await this.getConfigAt()
      const MiniMeToken = await this.environment.getArtifact('MiniMeToken', '@aragon/minime')
      this._feeToken = await MiniMeToken.at(feeToken)
    }
    return this._feeToken
  }

  async registry() {
    if (!this._registry) {
      const address = await this.instance.getJurorsRegistry()
      const JurorsRegistry = await this.environment.getArtifact('JurorsRegistry', '@1hive/celeste')
      this._registry = await JurorsRegistry.at(address)
    }
    return this._registry
  }

  async disputeManager() {
    if (!this._disputeManager) {
      const address = await this.instance.getDisputeManager()
      const DisputeManager = await this.environment.getArtifact('DisputeManager', '@1hive/celeste')
      this._disputeManager = await DisputeManager.at(address)
    }
    return this._disputeManager
  }

  async voting() {
    if (!this._voting) {
      const address = await this.instance.getVoting()
      const Voting = await this.environment.getArtifact('CRVoting', '@1hive/celeste')
      this._voting = await Voting.at(address)
    }
    return this._voting
  }

  async subscriptions() {
    if (!this._subscriptions) {
      const address = await this.instance.getSubscriptions()
      const Subscriptions = await this.environment.getArtifact('CourtSubscriptions', '@1hive/celeste')
      this._subscriptions = await Subscriptions.at(address)
    }
    return this._subscriptions
  }

  async termDuration() {
    return this.instance.getTermDuration()
  }

  async startTime() {
    const { startTime } = await this.instance.getTerm(1)
    return startTime // in seconds
  }

  async currentTermId() {
    return this.instance.getCurrentTermId()
  }

  async getTerm(id) {
    return this.instance.getTerm(id)
  }

  async neededTransitions() {
    return this.instance.getNeededTermTransitions()
  }

  async getConfigAt(termId = undefined) {
    if (!termId) termId = await this.currentTermId()
    const rawConfig = await this.instance.getConfig(termId)
    const { feeToken, fees, maxRulingOptions, roundParams, pcts, appealCollateralParams, jurorsParams } = rawConfig
    
    return {
      feeToken,
      fees: { jurorFee: fees[0], draftFee: fees[1], settleFee: fees[2] },
      maxRulingOptions,
      roundDurations: { evidenceTerms: roundParams[0], commitTerms: roundParams[1], revealTerms: roundParams[2], appealTerms: roundParams[3], appealConfirmationTerms: roundParams[4] },
      roundParams: { firstRoundJurorsNumber: roundParams[5], appealStepFactor: roundParams[6], maxRegularAppealRounds: roundParams[7], finalRoundLockTerms: roundParams[8] },
      appealCollateralParams: { appealCollateralFactor: appealCollateralParams[0], appealConfirmCollateralFactor: appealCollateralParams[1] },
      pcts: { penaltyPct: pcts[0], finalRoundReduction: pcts[1] },
      jurorsParams: { minActiveBalance: jurorsParams[0], minMaxPctTotalSupply: jurorsParams[1], maxMaxPctTotalSupply: jurorsParams[2]}
    }
  }


  async getRevealStatus(disputeId, roundNumber) {
    const disputeManager = await this.disputeManager()
    const { createTermId } = await disputeManager.getDispute(disputeId)
    const { draftTerm, delayedTerms } = await disputeManager.getRound(disputeId, roundNumber)
    const { roundDurations: { commitTerms, revealTerms } } = await this.getConfigAt(createTermId)

    const currentTerm = await this.currentTermId()
    const draftFinishedTerm = draftTerm.add(delayedTerms)
    const revealStartTerm = draftFinishedTerm.add(commitTerms)
    const appealStartTerm = revealStartTerm.add(revealTerms)

    const expired = currentTerm.gte(appealStartTerm)
    const canReveal = currentTerm.gte(revealStartTerm) && !expired

    return { canReveal, expired }
  }

  async canSettle(disputeId) {
    const disputeManager = await this.disputeManager()

    const { finalRuling, lastRoundId } = await disputeManager.getDispute(disputeId)
    if (finalRuling !== 0) return true

    const { state } = await disputeManager.getRound(disputeId, lastRoundId)
    return state === ROUND_STATE_ENDED
  }

  async getJurors(disputeId, roundNumber) {
    const result = await this.environment.query(`{ 
      dispute (id: "${disputeId}") {
        id
        rounds (where: { number: "${roundNumber}" }) { jurors { juror { id } }}
      }}`)
    return result.dispute.rounds[0].jurors.map(juror => juror.juror.id)
  }

  async existsVote(voteId) {
    const voting = await this.voting()
    const maxAllowedOutcomes = await voting.getMaxAllowedOutcome(voteId)
    return maxAllowedOutcomes !== 0
  }

  async isValidOutcome(voteId, outcome) {
    const voting = await this.voting()
    const exists = await this.existsVote(voteId)
    return exists && (await voting.isValidOutcome(voteId, outcome))
  }

  async getLastRoundVoteId(disputeId) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)
    return encodeVoteId(disputeId, lastRoundId)
  }

  async getCommitment(voteId, voter) {
    const result = await this.environment.query(`{ jurorDrafts (where: { round:"${voteId}", juror: "${voter}" }) { commitment }}`)
    return (!result || !result.jurorDrafts || result.jurorDrafts.length === 0) ? undefined : result.jurorDrafts[0].commitment
  }

  async getOutcome(voteId, voter) {
    const voting = await this.voting()
    return voting.getVoterOutcome(voteId, voter)
  }

  async getPeriod(periodId) {
    const subscriptions = await this.subscriptions()
    const provider = await this.environment.getProvider()

    // The period records are stored at the 7th index of the subscriptions contract storage
    const periodsRecordsSlot = padLeft(7, 64)
    // Parse period ID en hexadecimal and pad 64
    const periodIdHex = padLeft(toHex(periodId), 64)
    // The periods records variable is a mapping indexed by period IDs
    const periodsSlot = soliditySha3(periodIdHex + periodsRecordsSlot.slice(2))
    // The checkpoint and fee token are packed in the first element of the period struct, thus don't need to add any offset
    const checkpointAndFeeTokenSlot = periodsSlot
    // The fee amount is the second element of the struct, thus we add 1 to the period slot
    const feeAmountSlot = bn(periodsSlot).add(bn(1)).toHexString()
    // The total active balance is the third element of the struct, thus we add 2 to the period slot
    const totalActiveBalanceSlot = bn(periodsSlot).add(bn(2)).toHexString()
    // The collected fees is the fourth element of the struct, thus we add 3 to the period slot
    const collectedFeesSlot = bn(periodsSlot).add(bn(3)).toHexString()


    // The first part of the checkpoint and fee token slot is for the fee token
    const checkpointAndFeeToken = await provider.getStorageAt(subscriptions.address, checkpointAndFeeTokenSlot)
    const feeToken = `0x${checkpointAndFeeToken.substr(10, 40)}`

    // The balance checkpoint is stored using a uint64 and its stored at the end of the slot
    const rawBalanceCheckpoint = checkpointAndFeeToken.substr(50)
    const balanceCheckpoint = bn(`0x${rawBalanceCheckpoint}`).toString()

    // Parse the fee amount
    const rawFeeAmount = await provider.getStorageAt(subscriptions.address, feeAmountSlot)
    const feeAmount = bn(rawFeeAmount).toString()

    // Parse the total active balance
    const rawTotalActiveBalance = await provider.getStorageAt(subscriptions.address, totalActiveBalanceSlot)
    const totalActiveBalance = bn(rawTotalActiveBalance).toString()

    // Parse the collected fees
    const rawCollectedFees = await provider.getStorageAt(subscriptions.address, collectedFeesSlot)
    const collectedFees = bn(rawCollectedFees).toString()

    return { balanceCheckpoint, feeToken, feeAmount, totalActiveBalance, collectedFees }
  }

  async heartbeat(transitions = undefined) {
    const needed = await this.neededTransitions()
    logger.info(`Required ${needed} transitions`)
    if (needed.eq(bn(0))) return needed
    const heartbeats = transitions || needed
    logger.info(`Calling heartbeat with ${heartbeats} max transitions...`)
    await this.instance.heartbeat(heartbeats)
    return Math.min(heartbeats, needed)
  }

  async stake(juror, amount, data = '0x') {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    await this._approve(anj, bigExp(amount, decimals), registry.address)
    logger.info(`Staking HNY ${amount} for ${juror}...`)
    return registry.stakeFor(juror, bigExp(amount, decimals), data)
  }

  async unstake(amount, data = '0x') {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    logger.info(`Unstaking HNY ${amount} for ${await this.environment.getSender()}...`)
    return registry.unstake(bigExp(amount, decimals), data)
  }

  async activate(amount) {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    logger.info(`Activating HNY ${amount} for ${await this.environment.getSender()}...`)
    return registry.activate(bigExp(amount, decimals))
  }

  async activateFor(address, amount) {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    await this._approve(anj, bigExp(amount, decimals), registry.address)
    const ACTIVATE_DATA = sha3('activate(uint256)').slice(0, 10)
    logger.info(`Activating HNY ${amount} for ${address}...`)
    return registry.stakeFor(address, bigExp(amount, decimals), ACTIVATE_DATA)
  }

  async deactivate(amount) {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    logger.info(`Requesting HNY ${amount} from ${await this.environment.getSender()} for deactivation...`)
    return registry.deactivate(bigExp(amount, decimals))
  }

  async donate(amount) {
    const subscriptions = await this.subscriptions()
    const feeToken = await subscriptions.currentFeeToken()
    const ERC20 = await this.environment.getArtifact('ERC20', '@1hive/celeste')
    const token = await ERC20.at(feeToken)

    logger.info(`Approving ${amount} fees for donation...`)
    await this._approve(token, amount, subscriptions.address)
    logger.info(`Donating ${amount} fees for court jurors...`)
    return subscriptions.donate(amount)
  }

  async deployArbitrable(owner = undefined) {
    if (!owner) owner = await this.environment.getSender()
    logger.info(`Creating new Arbitrable instance with owner ${owner}...`)
    const Arbitrable = await this.environment.getArtifact('PrecedenceCampaignArbitrable', '@aragonone/precedence-campaign-arbitrable')
    return Arbitrable.new(owner, this.instance.address)
  }

  async subscribe(address, periods = 1) {
    const subscriptions = await this.subscriptions()
    const { feeToken, amountToPay } = await subscriptions.getPayFeesDetails(address, periods)

    const ERC20 = await this.environment.getArtifact('ERC20', '@1hive/celeste')
    const token = await ERC20.at(feeToken)

    logger.info(`Approving fees for ${periods} periods to ${subscriptions.address}, total amount ${fromWei(amountToPay.toString())}...`)
    await this._approve(token, amountToPay, subscriptions.address)
    logger.info(`Paying fees for ${periods} periods to ${subscriptions.address}...`)
    return subscriptions.payFees(address, periods)
  }

  async createDispute(subject, rulings = 2, metadata = '', evidence = [], submitters = [], closeEvidencePeriod = false) {
    logger.info(`Creating new dispute for subject ${subject} ...`)
    const Arbitrable = await this.environment.getArtifact('PrecedenceCampaignArbitrable', '@aragonone/precedence-campaign-arbitrable')
    const arbitrable = await Arbitrable.at(subject)

    const shouldCreateAndSubmit = evidence.length === 2 && submitters.length === 2
    const { hash } = shouldCreateAndSubmit
      ? (await arbitrable.createAndSubmit(rulings, utf8ToHex(metadata), submitters[0], submitters[1], utf8ToHex(evidence[0]), utf8ToHex(evidence[1])))
      : (await arbitrable.createDispute(rulings, utf8ToHex(metadata)))

    const DisputeManager = await this.environment.getArtifact('DisputeManager', '@1hive/celeste')
    const { logs: rawLogs } = await this.environment.getTransaction(hash)
    const logs = decodeEventsOfType({ receipt: { rawLogs }}, DisputeManager.abi, DISPUTE_MANAGER_EVENTS.NEW_DISPUTE)
    const disputeId = getEventArgument({ logs }, DISPUTE_MANAGER_EVENTS.NEW_DISPUTE, 'disputeId')

    if (!shouldCreateAndSubmit) {
      for (const data of evidence) {
        const index = evidence.indexOf(data)
        const submitter = submitters[index]
        if (submitter) {
          logger.info(`Submitting evidence ${data} for dispute #${disputeId} for submitter ${submitter}...`)
          await arbitrable.submitEvidenceFor(disputeId, submitter, utf8ToHex(data), false)
        } else {
          logger.info(`Submitting evidence ${data} for dispute #${disputeId} for sender ...`)
          await arbitrable.submitEvidence(disputeId, utf8ToHex(data), false)
        }
      }
    }

    if (closeEvidencePeriod) {
      logger.info(`Closing evidence period for dispute #${disputeId} ...`)
      await arbitrable.closeEvidencePeriod(disputeId)
    }

    return disputeId
  }

  async draft(disputeId) {
    const disputeManager = await this.disputeManager()
    logger.info(`Drafting dispute #${disputeId} ...`)
    const { hash } = await disputeManager.draft(disputeId)
    const { logs: rawLogs } = await this.environment.getTransaction(hash)
    const logs = decodeEventsOfType({ receipt: { rawLogs }}, disputeManager.interface.abi, DISPUTE_MANAGER_EVENTS.JUROR_DRAFTED)
    return getEvents({ logs }, DISPUTE_MANAGER_EVENTS.JUROR_DRAFTED).map(event => event.args.juror)
  }

  async commit(disputeId, outcome, password) {
    const voteId = await this.getLastRoundVoteId(disputeId)
    logger.info(`Committing a vote for dispute #${disputeId} on vote ID ${voteId}...`)
    const voting = await this.voting()
    return voting.commit(voteId, hashVote(outcome, soliditySha3(password)))
  }

  async reveal(disputeId, juror, outcome, password) {
    const voteId = await this.getLastRoundVoteId(disputeId)
    return this.revealFor(voteId, juror, outcome, soliditySha3(password))
  }

  async revealFor(voteId, juror, outcome, salt) {
    logger.info(`Revealing vote for juror ${juror} on vote ID ${voteId}...`)
    const voting = await this.voting()
    return voting.reveal(voteId, juror, outcome, salt)
  }

  async appeal(disputeId, outcome) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    const feeToken = await this.feeToken()
    const { appealDeposit } = await disputeManager.getNextRoundDetails(disputeId, lastRoundId)
    await this._approve(feeToken, appealDeposit, disputeManager.address)

    logger.info(`Appealing dispute #${disputeId} and round #${lastRoundId} in favour of outcome ${outcome}...`)
    return disputeManager.createAppeal(disputeId, lastRoundId, outcome)
  }

  async confirmAppeal(disputeId, outcome) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    const feeToken = await this.feeToken()
    const { confirmAppealDeposit } = await disputeManager.getNextRoundDetails(disputeId, lastRoundId)
    await this._approve(feeToken, confirmAppealDeposit, disputeManager.address)

    logger.info(`Confirming appeal for dispute #${disputeId} and round #${lastRoundId} in favour of outcome ${outcome}...`)
    return disputeManager.confirmAppeal(disputeId, lastRoundId, outcome)
  }

  async settleRound(disputeId) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    for (let roundId = 0; roundId <= lastRoundId; roundId++) {
      logger.info(`Settling penalties for dispute #${disputeId} and round #${roundId}...`)
      await disputeManager.settlePenalties(disputeId, roundId, 0)

      if (lastRoundId > roundId) {
        logger.info(`Settling appeal deposits for dispute #${disputeId} and round #${roundId}...`)
        await disputeManager.settleAppealDeposit(disputeId, roundId)
      }
    }
  }

  async settleJuror(disputeId, juror) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    for (let roundId = 0; roundId <= lastRoundId; roundId++) {
      const { weight } = await disputeManager.getJuror(disputeId, roundId, juror)
      if (weight.gt(bn(0))) {
        logger.info(`Settling rewards of juror ${juror} for dispute #${disputeId} and round #${roundId}...`)
        await disputeManager.settleReward(disputeId, roundId, juror)
      }
    }
  }

  async execute(disputeId) {
    logger.info(`Executing ruling of dispute #${disputeId}...`)
    return this.instance.rule(disputeId)
  }

  async settle(disputeId) {
    const voting = await this.voting()
    const disputeManager = await this.disputeManager()
    const { finalRuling: ruling, lastRoundId } = await disputeManager.getDispute(disputeId)

    // Execute final ruling if missing
    if (ruling === 0) await this.execute(disputeId)
    const { finalRuling } = await disputeManager.getDispute(disputeId)

    // Settle rounds
    for (let roundNumber = 0; roundNumber <= lastRoundId; roundNumber++) {
      const { jurorsNumber, settledPenalties } = await disputeManager.getRound(disputeId, roundNumber)

      // settle penalties
      if (!settledPenalties) {
        logger.info(`Settling penalties for dispute #${disputeId} round #${roundNumber}`)
        await disputeManager.settlePenalties(disputeId, roundNumber, jurorsNumber)
        logger.success(`Settled penalties for dispute #${disputeId} round #${roundNumber}`)
      }

      // settle juror rewards
      const voteId = encodeVoteId(disputeId, roundNumber)
      const jurors = await this.getJurors(disputeId, roundNumber)
      for (const juror of jurors) {
        const votedOutcome = await voting.getVoterOutcome(voteId, juror)
        if (votedOutcome === finalRuling) {
          logger.info(`Settling rewards of juror ${juror} for dispute #${disputeId} and round #${roundNumber}...`)
          await disputeManager.settleReward(disputeId, roundNumber, juror)
          logger.success(`Settled rewards of juror ${juror} for dispute #${disputeId} and round #${roundNumber}...`)
        }
      }

      // settle appeals
      const { taker } = await disputeManager.getAppeal(disputeId, roundNumber)
      if (taker != ZERO_ADDRESS) {
        try {
          logger.info(`Settling appeal deposits for dispute #${disputeId} round #${roundNumber}`)
          await disputeManager.settleAppealDeposit(disputeId, roundNumber)
          logger.success(`Settled penalties for dispute #${disputeId} round #${roundNumber}`)
        } catch (error) {
          if (!error.message.includes(DISPUTE_MANAGER_ERRORS.APPEAL_ALREADY_SETTLED)) throw error
        }
      }
    }
  }

  async _approve(token, amount, recipient) {
    const allowance = await token.allowance(await this.environment.getSender(), recipient)
    if (allowance.gt(bn(0))) {
      logger.info(`Resetting allowance to zero for ${recipient}...`)
      await token.approve(recipient, 0)
    }
    logger.info(`Approving ${fromWei(amount.toString())} tokens to ${recipient}...`)
    await token.approve(recipient, amount)
  }
}
