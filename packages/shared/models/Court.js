const logger = require('../helpers/logger')('Court')
const { bn } = require('../helpers/numbers')
const { fromWei, fromAscii } = require('web3-utils')
const { getEventArgument } = require('@aragon/test-helpers/events')
const { decodeEventsOfType } = require('@aragon/court/test/helpers/lib/decodeEvent')
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
      await arbitrable.submitEvidence(disputeId, data, false)
    }

    return disputeId
  }

  async subscribe(periods = 1, address = undefined) {
    let arbitrable
    const Arbitrable = await this.environment.getArtifact('ArbitrableMock', '@aragon/court')
    if (address) arbitrable = await Arbitrable.at(address)
    else {
      logger.info('Creating new Arbitrable instance...')
      arbitrable = await Arbitrable.new(this.instance.address)
    }

    const { recipient, feeToken, feeAmount } = await this.instance.getSubscriptionFees(arbitrable.address)
    const ERC20 = await this.environment.getArtifact('ERC20', '@aragon/court')
    const token = await ERC20.at(feeToken)

    await this._approve(token, feeAmount, recipient)
    const subscriptions = await this.subscriptions()
    logger.info(`Paying fees for ${periods} periods to ${subscriptions.address}...`)
    await subscriptions.payFees(arbitrable.address, periods)
    return arbitrable
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
