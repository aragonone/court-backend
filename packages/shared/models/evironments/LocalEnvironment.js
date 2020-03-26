const Environment = require('./Environment')
const DynamicArtifacts = require('../artifacts/DynamicArtifacts')
const PkWalletProvider = require('../providers/PkWalletProvider')

require('dotenv').config() // Load env vars from .env file

/**
 * Requires the following env variables to be defined:
 *   - NETWORK: Network to connect to: rpc, rinkeby, mainnet, ...
 *   - PRIVATE_KEY: Private key of the account used
 *   - RPC: RPC endpoint, like "https://host:port/..."
 *   - COURT_ADDRESS: Address of the target Court contract to interact with
 *   - GAS_PRICE: Gas price (for TruffleContract object)
 *   - GAS: Gas limit (for TruffleContract object)
 *   - WEB3_POLLING_INTERVAL: Milliseconds interval for blocks polling
 */

const { NETWORK, COURT_ADDRESS, RPC, PRIVATE_KEY, GAS, GAS_PRICE, WEB3_POLLING_INTERVAL } = process.env

class LocalEnvironment extends Environment {
  constructor() {
    super(NETWORK)
  }

  async getCourt(address = undefined) {
    return super.getCourt(COURT_ADDRESS)
  }

  async _getProvider() {
    return new PkWalletProvider(PRIVATE_KEY, RPC, { pollingInterval: WEB3_POLLING_INTERVAL })
  }

  async _getArtifacts() {
    const from = await this.getSender()
    const provider = await this.getProvider()
    return new DynamicArtifacts(provider, { from, gasPrice: GAS_PRICE, gas: GAS })
  }

  async _getSender() {
    const provider = await this.getProvider()
    return provider.getAddress()
  }
}

module.exports = LocalEnvironment
