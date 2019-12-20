import Web3 from 'web3'
import Artifacts from './Artifacts'
import GasOracle from './GasOracle'

export default class {
  constructor(provider, sender) {
    this.provider = provider
    this.sender = sender
  }

  async getWeb3() {
    if (!this.web3) this.web3 = new Web3(this.provider)
    return this.web3
  }

  async getArtifact(contractName, dependency = undefined) {
    const artifacts = await this.getArtifacts()
    return artifacts.require(contractName, dependency)
  }

  async getArtifacts() {
    if (!this.artifacts) {
      const from = this.sender
      const gasPrice = await GasOracle.fetch(parseInt(this.provider.chainId))
      this.artifacts = new Artifacts(this.provider, { from, gasPrice })
    }
    return this.artifacts
  }
}
