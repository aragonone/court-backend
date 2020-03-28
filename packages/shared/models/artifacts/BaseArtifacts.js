const { ethers } = require('ethers')

class BaseArtifacts {
  constructor(signer) {
    this.signer = signer
  }

  getContractSchema(contractName, dependency = undefined) {
    throw Error('subclass responsibility')
  }

  require(contractName, dependency = undefined) {
    const schema = this.getContractSchema(contractName, dependency)
    if (!schema) throw Error(`Please make sure you provide a contract schema for ${dependency}/${contractName}`)
    return this.buildArtifact(schema)
  }

  buildArtifact(schema) {
    const { signer } = this
    return {
      get abi() {
        return schema.abi
      },

      async new(...args) {
        const factory = new ethers.ContractFactory(schema.abi, schema.bytecode, signer)
        return factory.deploy(...args)
      },

      async at(address) {
        return new ethers.Contract(address, schema.abi, signer)
      }
    }
  }
}

module.exports = BaseArtifacts
