const { ethers } = require('ethers')
const sleep = require('../../helpers/sleep')
const Environment = require('./Environment')
const JsonRpcSigner = require('../providers/JsonRpcSigner')
const StaticArtifacts = require('../artifacts/StaticArtifacts')

class BrowserEnvironment extends Environment {
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
    return new ethers.providers.Web3Provider(provider)
  }

  async _getSigner() {
    const provider = await this.getProvider()
    return new JsonRpcSigner(provider)
  }

  async _getArtifacts() {
    const signer = await this.getSigner()
    return new StaticArtifacts(signer)
  }
}

module.exports = BrowserEnvironment
