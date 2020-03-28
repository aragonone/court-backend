const { ethers } = require('ethers')
const Environment = require('./Environment')
const TruffleConfig = require('@truffle/config')
const JsonRpcSigner = require('../providers/JsonRpcSigner')
const DynamicArtifacts = require('../artifacts/DynamicArtifacts')

class TruffleEnvironment extends Environment {
  constructor(network, sender = undefined) {
    super(network)
    this.sender = sender
  }

  async getCourt(address = undefined) {
    if (address) return super.getCourt(address)
    if (process.env.COURT) return super.getCourt(process.env.COURT)
    const config = require('../../truffle-config')
    const { court } = config.networks[this.network] || { court: undefined }
    if (!court) throw Error(`Missing court address for network ${this.network}`)
    return super.getCourt(court)
  }

  async _getProvider() {
    const { provider } = this._getNetworkConfig()
    return new ethers.providers.Web3Provider(provider)
  }

  async _getSigner() {
    const { from, gas, gasPrice } = this._getNetworkConfig()
    const provider = await this.getProvider()
    return new JsonRpcSigner(provider, this.sender || from, { gasLimit: gas, gasPrice })
  }

  async _getArtifacts() {
    const signer = await this.getSigner()
    return new DynamicArtifacts(signer)
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
