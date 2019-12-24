const Environment = require('./Environment')
const TruffleConfig = require('@truffle/config')
const DynamicArtifacts = require('../artifacts/DynamicArtifacts')

class TruffleEnvironment extends Environment {
  constructor(network, sender = undefined) {
    super(network, sender)
  }

  async getCourt(address = undefined) {
    if (address) return super.getCourt(address)
    const config = require('../../truffle-config')
    const { court } = config.networks[this.network] || { court: undefined }
    if (!court) throw Error(`Missing court address for network ${this.network}`)
    return super.getCourt(court)
  }

  async _getProvider() {
    const { provider } = this._getNetworkConfig()
    return provider
  }

  async _getArtifacts() {
    const from = await this.getSender()
    const provider = await this.getProvider()
    const { gasPrice, gas } = this._getNetworkConfig()
    return new DynamicArtifacts(provider, { from, gasPrice, gas })
  }

  async _getSender() {
    const { from } = this._getNetworkConfig()
    return from ? from : (await this.getAccounts())[0]
  }

  _getNetworkConfig() {
    if (!this.config) {
      this.config = TruffleConfig.detect({ logger: console })
      this.config.network = this.network
    }
    return this.config
  }
}

module.exports = TruffleEnvironment
