const path = require('path')
const BaseArtifacts = require('./BaseArtifacts')

class DynamicArtifacts extends BaseArtifacts {
  getContractSchema(contractName, dependency = undefined) {
    const contractPath = dependency
      ? this._getNodeModulesPath(dependency, contractName)
      : this._getLocalBuildPath(contractName)

    return require(contractPath)
  }

  _getLocalBuildPath(contractName) {
    return path.resolve(process.cwd(), `./build/contracts/${contractName}.json`)
  }

  _getNodeModulesPath(dependency, contractName) {
    return path.resolve(__dirname, `../../node_modules/${dependency}/build/contracts/${contractName}.json`)
  }
}

module.exports = DynamicArtifacts
