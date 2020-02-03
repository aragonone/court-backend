const BaseArtifacts = require('./BaseArtifacts')

const BUILDS = {
  '@aragon/erc20-faucet': {
    'ERC20Faucet': require('@aragonone/erc20-faucet/build/contracts/ERC20Faucet'),
  },
  '@aragon/minime': {
    'MiniMeToken': require('@aragon/minime/build/contracts/MiniMeToken')
  },
  '@aragon/court': {
    'AragonCourt': require('@aragon/court/build/contracts/AragonCourt'),
    'DisputeManager': require('@aragon/court/build/contracts/DisputeManager'),
    'JurorsRegistry': require('@aragon/court/build/contracts/JurorsRegistry'),
    'CourtSubscriptions': require('@aragon/court/build/contracts/CourtSubscriptions'),
  }
}

class StaticArtifacts extends BaseArtifacts {
  getContractSchema(contractName, dependency = undefined) {
    return BUILDS[dependency][contractName]
  }
}

module.exports = StaticArtifacts
