import TruffleContract from '@truffle/contract'

const BUILDS = {
  '@aragon/erc20-faucet': {
    'ERC20Faucet': require('@aragon/erc20-faucet/build/contracts/ERC20Faucet'),
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

export default class Artifacts {
  constructor(provider, defaults = {}) {
    this.defaults = defaults
    this.provider = provider
  }

  require(contractName, dependency = undefined) {
    const schema = BUILDS[dependency][contractName]
    if (!schema) throw Error(`Please add static build file for ${dependency}/${contractName}`)
    const Contract = TruffleContract(schema)
    Contract.defaults(this.defaults)
    Contract.setProvider(this.provider)
    return Contract
  }
}
