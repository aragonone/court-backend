const logger = require('../helpers/logger')('Court')
const { bn, bigExp } = require('../helpers/numbers')
const { fromWei, fromAscii, soliditySha3 } = require('web3-utils')
const { getEventArgument } = require('@aragon/test-helpers/events')
const { decodeEventsOfType } = require('@aragon/court/test/helpers/lib/decodeEvent')
const { getVoteId, hashVote } = require('@aragon/court/test/helpers/utils/crvoting')
const { DISPUTE_MANAGER_EVENTS } = require('@aragon/court/test/helpers/utils/events')

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
      const subscriptions = await this.subscriptions()
      const address = await subscriptions.currentFeeToken()
      const MiniMeToken = await this.environment.getArtifact('MiniMeToken', '@aragon/minime')
      this._feeToken = await MiniMeToken.at(address)
    }
    return this._feeToken
  }

  async registry() {
    if (!this._registry) {
      const address = await this.instance.getJurorsRegistry()
      const JurorsRegistry = await this.environment.getArtifact('JurorsRegistry', '@aragon/court')
      this._registry = await JurorsRegistry.at(address)
    }
    return this._registry
  }

  async disputeManager() {
    if (!this._disputeManager) {
      const address = await this.instance.getDisputeManager()
      const DisputeManager = await this.environment.getArtifact('DisputeManager', '@aragon/court')
      this._disputeManager = await DisputeManager.at(address)
    }
    return this._disputeManager
  }

  async voting() {
    if (!this._voting) {
      const address = await this.instance.getVoting()
      const Voting = await this.environment.getArtifact('CRVoting', '@aragon/court')
      this._voting = await Voting.at(address)
    }
    return this._voting
  }

  async subscriptions() {
    if (!this._subscriptions) {
      const address = await this.instance.getSubscriptions()
      const Subscriptions = await this.environment.getArtifact('CourtSubscriptions', '@aragon/court')
      this._subscriptions = await Subscriptions.at(address)
    }
    return this._subscriptions
  }

  async neededTransitions() {
    return await this.instance.getNeededTermTransitions()
  }

  async heartbeat(transitions = undefined) {
    const needed = await this.neededTransitions()
    logger.info(`Required ${needed} transitions`)
    if (needed.eq(bn(0))) return needed
    const heartbeats = transitions || needed
    logger.info(`Calling heartbeat with ${heartbeats} max transitions...`)
    await this.instance.heartbeat(heartbeats)
    return heartbeats
  }

  async stake(juror, amount, data = '0x') {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    await this._approve(anj, bigExp(amount, decimals), registry.address)
    logger.info(`Staking ANJ ${amount} for ${juror}...`)
    await registry.stakeFor(juror, bigExp(amount, decimals), data)
  }

  async activate(amount) {
    const anj = await this.anj()
    const decimals = await anj.decimals()
    const registry = await this.registry()
    logger.info(`Activating ANJ ${amount} for ${await this.environment.getSender()}...`)
    await registry.activate(bigExp(amount, decimals))
  }

  async deployArbitrable() {
    logger.info('Creating new Arbitrable instance...')
    const Arbitrable = await this.environment.getArtifact('ArbitrableMock', '@aragon/court')
    return Arbitrable.new(this.instance.address)
  }

  async subscribe(address, periods = 1) {
    const Arbitrable = await this.environment.getArtifact('ArbitrableMock', '@aragon/court')
    const arbitrable = await Arbitrable.at(address)

    const { recipient, feeToken, feeAmount } = await this.instance.getSubscriptionFees(arbitrable.address)
    const ERC20 = await this.environment.getArtifact('ERC20', '@aragon/court')
    const token = await ERC20.at(feeToken)

    await this._approve(token, feeAmount, recipient)
    const subscriptions = await this.subscriptions()
    logger.info(`Paying fees for ${periods} periods to ${subscriptions.address}...`)
    await subscriptions.payFees(arbitrable.address, periods)
  }

  async createDispute(subject, rulings = 2, metadata = '', evidence = []) {
    logger.info(`Creating new dispute for subject ${subject} ...`)
    const Arbitrable = await this.environment.getArtifact('ArbitrableMock', '@aragon/court')
    const arbitrable = await Arbitrable.at(subject)
    const receipt = await arbitrable.createDispute(rulings, fromAscii(metadata))
    const DisputeManager = await this.environment.getArtifact('DisputeManager', '@aragon/court')
    const logs = decodeEventsOfType(receipt, DisputeManager.abi, DISPUTE_MANAGER_EVENTS.NEW_DISPUTE)
    const disputeId = getEventArgument({ logs }, DISPUTE_MANAGER_EVENTS.NEW_DISPUTE, 'disputeId')

    for (const data of evidence) {
      logger.info(`Submitting evidence ${data} for dispute #${disputeId} ...`)
      await arbitrable.submitEvidence(disputeId, fromAscii(data), false)
    }

    return disputeId
  }

  async draft(disputeId) {
    const disputeManager = await this.disputeManager()
    const { subject, lastRoundId } = await disputeManager.getDispute(disputeId)
    const { draftTerm } = await disputeManager.getRound(disputeId, lastRoundId)
    const currentTermId  = await this.instance.getCurrentTermId()

    if (draftTerm.gt(currentTermId)) {
      logger.info(`Closing evidence period for dispute #${disputeId} ...`)
      const Arbitrable = await this.environment.getArtifact('ArbitrableMock', '@aragon/court')
      const arbitrable = await Arbitrable.at(subject)
      await arbitrable.submitEvidence(disputeId, fromAscii('closing evidence submission period'), true)
    }

    logger.info(`Drafting dispute #${disputeId} ...`)
    await disputeManager.draft(disputeId)
  }

  async commit(disputeId, outcome, password) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)
    const voteId = getVoteId(disputeId, lastRoundId)

    logger.info(`Committing a vote for dispute #${disputeId} and round #${lastRoundId}...`)
    const voting = await this.voting()
    await voting.commit(voteId, hashVote(outcome, soliditySha3(password)))
  }

  async reveal(disputeId, outcome, password) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)
    const voteId = getVoteId(disputeId, lastRoundId)

    logger.info(`Revealing vote for dispute #${disputeId} and round #${lastRoundId}...`)
    const voting = await this.voting()
    await voting.reveal(voteId, outcome, soliditySha3(password))
  }

  async appeal(disputeId, outcome) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    const feeToken = await this.feeToken()
    const { appealDeposit } = await disputeManager.getNextRoundDetails(disputeId, lastRoundId)
    await this._approve(feeToken, appealDeposit, disputeManager.address)

    logger.info(`Appealing dispute #${disputeId} and round #${lastRoundId} in favour of outcome ${outcome}...`)
    await disputeManager.createAppeal(disputeId, lastRoundId, outcome)
  }

  async confirmAppeal(disputeId, outcome) {
    const disputeManager = await this.disputeManager()
    const { lastRoundId } = await disputeManager.getDispute(disputeId)

    const feeToken = await this.feeToken()
    const { confirmAppealDeposit } = await disputeManager.getNextRoundDetails(disputeId, lastRoundId)
    await this._approve(feeToken, confirmAppealDeposit, disputeManager.address)

    logger.info(`Confirming appeal for dispute #${disputeId} and round #${lastRoundId} in favour of outcome ${outcome}...`)
    await disputeManager.confirmAppeal(disputeId, lastRoundId, outcome)
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

  async _approve(token, amount, recipient) {
    const allowance = await token.allowance(await this.environment.getSender(), recipient)
    if (allowance.gt(bn(0))) {
      logger.info(`Resetting allowance to zero for ${recipient}...`)
      await token.approve(recipient, 0)
    }
    logger.info(`Approving ${fromWei(amount)} tokens to ${recipient}...`)
    await token.approve(recipient, amount)
  }
}
