const sleep = require('../../helpers/sleep')
const Environment = require('./Environment')
const StaticArtifacts = require('../artifacts/StaticArtifacts')

class MetamaskEnvironment extends Environment {
  constructor(network) {
    super(network)
  }

  async isEnabled() {
    await sleep(2)
    const { web3 } = window
    return !!(web3 && web3.currentProvider && web3.currentProvider.selectedAddress)
  }

  async _getProvider() {
    const isEnabled = await this.isEnabled()
    if (!isEnabled) throw Error('Could not access to a browser web3 provider, please make sure to allow one.')
    const provider = window.web3.currentProvider
    provider.setMaxListeners(300)
    return provider
  }

  async _getArtifacts() {
    const from = await this.getSender()
    const provider = await this.getProvider()
    return new StaticArtifacts(provider, { from })
  }

  async _getSender() {
    const provider = await this.getProvider()
    return provider.selectedAddress
  }
}

module.exports = MetamaskEnvironment
