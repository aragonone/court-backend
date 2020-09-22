const fs = require('fs')
const path = require('path')
const BaseArtifacts = require('./BaseArtifacts')

const BUILD_DIRS = ['build/contracts', 'artifacts']

class DynamicArtifacts extends BaseArtifacts {
  getContractSchema(contractName, dependency = undefined) {
    const contractPaths = dependency
      ? this._getNodeModulesPaths(dependency, contractName)
      : this._getLocalBuildPaths(contractName)

    return this._findArtifact(contractPaths)
  }

  _findArtifact(paths) {
    const path = paths.find(fs.existsSync)
    return path ? require(path) : undefined
  }

  _getLocalBuildPaths(contractName) {
    return BUILD_DIRS.map(dir => path.resolve(process.cwd(), `./${dir}/${contractName}.json`))
  }

  _getNodeModulesPaths(dependency, contractName) {
    return BUILD_DIRS.map(dir => `${process.cwd()}/node_modules/${dependency}/${dir}/${contractName}.json`)
  }
}

module.exports = DynamicArtifacts
