const Web3 = require('web3')
const Artifacts = require('./Artifacts')
const TruffleConfig = require('@truffle/config')

module.exports = class {
  constructor(network, sender = undefined) {
    this.network = network
    this.sender = sender
  }

  async getArtifact(contractName, dependency = undefined) {
    const artifacts = await this.getArtifacts()
    return artifacts.require(contractName, dependency)
  }

  async getArtifacts() {
    if (!this.artifacts) {
      const from = await this.getSender()
      const { gasPrice, gas, provider } = this._getNetworkConfig()
      this.artifacts = new Artifacts(provider, { from, gasPrice, gas })
    }
    return this.artifacts
  }

  async getAccounts() {
    const web3 = this.getWeb3()
    return web3.eth.getAccounts()
  }

  async getSender() {
    if (!this.sender) {
      const { from } = this._getNetworkConfig()
      this.sender = from ? from : (await this.getAccounts())[0]
    }
    return this.sender
  }

  getWeb3() {
    if (!this.web3) {
      const { provider } = this._getNetworkConfig()
      this.web3 = new Web3(provider)
    }
    return this.web3
  }

  _getNetworkConfig() {
    if (!this.config) {
      this.config = TruffleConfig.detect({ logger: console })
      this.config.network = this.network
    }
    return this.config
  }
}
