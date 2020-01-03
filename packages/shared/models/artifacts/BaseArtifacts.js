const TruffleContract = require('@truffle/contract')

class BaseArtifacts {
  constructor(provider, defaults = {}) {
    this.defaults = defaults
    this.provider = provider
  }

  getContractSchema(contractName, dependency = undefined) {
    throw Error('subclass responsibility')
  }

  require(contractName, dependency = undefined) {
    const schema = this.getContractSchema(contractName, dependency)
    if (!schema) throw Error(`Please make sure you provide a contract schema for ${dependency}/${contractName}`)

    const Contract = TruffleContract(schema)
    Contract.defaults(this.defaults)
    Contract.setProvider(this.provider)
    return Contract
  }
}

module.exports = BaseArtifacts
