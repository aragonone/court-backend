const path = require('path')
const TruffleContract = require('@truffle/contract')

module.exports = class Artifacts {
  constructor(provider, defaults) {
    this.defaults = defaults
    this.provider = provider
  }

  require(contractName, dependency = undefined) {
    const contractPath = dependency
      ? this._getNodeModulesPath(dependency, contractName)
      : this._getLocalBuildPath(contractName)

    const Contract = TruffleContract(require(contractPath))
    Contract.defaults(this.defaults)
    Contract.setProvider(this.provider)
    return Contract
  }

  _getLocalBuildPath(contractName) {
    return path.resolve(process.cwd(), `./build/contracts/${contractName}.json`)
  }

  _getNodeModulesPath(dependency, contractName) {
    return `${process.cwd()}/node_modules/${dependency}/build/contracts/${contractName}.json`
  }
}
